const logger = require('tracer').colorConsole();
const PolicyTypeModel = require('../models/policyType.model');
const responseLib = require('../libs/response.lib');

exports.getAllPolicyTypes = async (req, res) => {
  try {
    const policies = await PolicyTypeModel.find().lean();
    return responseLib.success(res, 200, policies, 'All Policies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
