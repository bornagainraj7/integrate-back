const logger = require('tracer').colorConsole();
const axios = require('axios').default;
const PolicyTypeModel = require('../models/policyType.model');
const responseLib = require('../libs/response.lib');

const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'policy:Type',
});
exports.getAllPolicyTypes = async (req, res) => {
  let policies;
  try {
    // const policies = await PolicyTypeModel.find().select('-__v').lean();
    const response = await axios.get('https://api.insurancesamadhan.com/policy_type');
    if (response.data.success) {
      policies = response.data.data
        .map((data) => {
          delete data.__v;
          return data;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
    }

    policies.forEach(async (policy) => {
      // await new PolicyTypeModel(policy).save();
      await PolicyTypeModel.findByIdAndUpdate(
        { _id: policy._id },
        policy,
        { upsert: true, new: true },
      );
    });
    let policy_type;
    const cache_data = await cache._get(policy_type);
    if (!cache_data) {
      policies = await PolicyTypeModel.find().lean();
      cache._set(policy_type, JSON.stringify(policies));
    } else {
      policies = JSON.parse(cache_data);
      // console.log('From Case....', cache_data);
    }
    return responseLib.success(res, 200, policies, 'All Policies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
