const logger = require('tracer').colorConsole();
const ComplaintTypeModel = require('../models/complaintType.model');
const responseLib = require('../libs/response.lib');

exports.getAllComplaintTypes = async (req, res) => {
  try {
    const complaints = await ComplaintTypeModel.find().lean();
    return responseLib.success(res, 200, complaints, 'All Complaint Types fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
