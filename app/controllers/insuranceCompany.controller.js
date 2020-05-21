const logger = require('tracer').colorConsole();
const InsuranceCompanyModel = require('../models/insuranceCompany.model');
const responseLib = require('../libs/response.lib');

exports.getAllInsuranceCompaies = async (req, res) => {
  try {
    const insCompanies = await InsuranceCompanyModel.find().lean();
    return responseLib.success(res, 200, insCompanies, 'All Insurance Companies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
