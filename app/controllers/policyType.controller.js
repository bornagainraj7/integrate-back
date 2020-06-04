const logger = require('tracer').colorConsole();
const axios = require('axios').default;
const PolicyTypeModel = require('../models/policyType.model');
const responseLib = require('../libs/response.lib');

exports.getAllPolicyTypes = async (req, res) => {
  let policyTypes;
  try {
    // const policies = await PolicyTypeModel.find().select('-__v').lean();
    const response = await axios.get('https://api.insurancesamadhan.com/policy_type');
    if (response.data.success) {
      policyTypes = response.data.data
        .map((data) => {
          delete data.__v;
          return data;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
    }

    policyTypes.forEach(async (policy) => {
      // await new PolicyTypeModel(policy).save();
      await PolicyTypeModel.findByIdAndUpdate(
        { _id: policy._id },
        policy,
        { upsert: true, new: true },
      );
    });
    return responseLib.success(res, 200, policyTypes, 'All Policies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
