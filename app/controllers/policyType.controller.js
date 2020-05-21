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
<<<<<<< HEAD
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
=======
    let policies;
>>>>>>> work on redis cache
    let policyType;
    const cacheData = await cache._get(policyType);
    if (!cacheData) {
      policies = await PolicyTypeModel.find().lean();
      cache._set(policyType, JSON.stringify(policies));
    } else {
      policies = JSON.parse(cacheData);
      // logger.info('From Case....', cacheData);
    }
    return responseLib.success(res, 200, policies, 'All Policies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
