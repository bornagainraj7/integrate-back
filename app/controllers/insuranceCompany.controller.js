const logger = require('tracer').colorConsole();
const axios = require('axios').default;
// const InsuranceCompanyModel = require('../models/insuranceCompany.model');
const responseLib = require('../libs/response.lib');

exports.getAllInsuranceCompaies = async (req, res) => {
  let insCompanies;
  try {
    // const insCompanies = await InsuranceCompanyModel.find().select('-__v').lean();
    const response = await axios.get('https://api.insurancesamadhan.com/insurance_company');
    if (response.data.success) {
      insCompanies = response.data.data
        .map((data) => {
          delete data.__v;
          return data;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
    }
    return responseLib.success(res, 200, insCompanies, 'All Insurance Companies fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
