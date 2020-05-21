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
