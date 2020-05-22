const logger = require('tracer').colorConsole();
const InsuranceCompanyModel = require('../models/insuranceCompany.model');
const responseLib = require('../libs/response.lib');
const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'Insurance:Companys',
});

exports.getAllInsuranceCompaies = async (req, res) => {
  try {
    let insCompanies;
    let insCompany;
    const cacheData = await cache._get(insCompany);
    if (!cacheData) {
      insCompanies = await InsuranceCompanyModel.find().lean();
      /* set cache */
      cache._set(insCompany, JSON.stringify(insCompanies));
    } else {
      insCompanies = JSON.parse(cacheData);
      logger.info('From Case....', insCompanies);
    }
    return responseLib.success(
      res,
      200,
      insCompanies,
      'All Insurance Companies fetched successfully',
    );
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
