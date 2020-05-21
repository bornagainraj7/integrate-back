const logger = require('tracer').colorConsole();
const PolicyTypeModel = require('../models/policyType.model');
const responseLib = require('../libs/response.lib');

const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'policy:Type',
});
exports.getAllPolicyTypes = async (req, res) => {
  try {
    let policies;
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
