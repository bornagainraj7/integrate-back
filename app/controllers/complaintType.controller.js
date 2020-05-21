const logger = require('tracer').colorConsole();
const ComplaintTypeModel = require('../models/complaintType.model');
const responseLib = require('../libs/response.lib');
const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'Complaint:Type',
});

exports.getAllComplaintTypes = async (req, res) => {
  try {
    let complaints;
    let insComplaints;
    const cache_data = await cache._get(insComplaints);
    if (!cache_data) {
      complaints = await ComplaintTypeModel.find().lean();
      /* set cache */
      cache._set(insComplaints, JSON.stringify(complaints));
    } else {
      complaints = JSON.parse(cache_data);
      // console.log('From Case....', complaints);
    }
    return responseLib.success(
      res,
      200,
      complaints,
      'All Complaint Type ids retirived successfully',
    );
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
