const logger = require('tracer').colorConsole();
const axios = require('axios').default;
const ComplaintTypeModel = require('../models/complaintType.model');
const responseLib = require('../libs/response.lib');
const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'Complaint:Type',
});

exports.getComplaintTypes = async (req, res) => {
  const { policyTypeId } = req.params || req.query;
  let complaints;
  try {
    // const complaintTypes = await ComplaintTypeModel.find().select('-__v').lean();
    const response = await axios.get(`https://api.insurancesamadhan.com/complaint_type?policyTypeId=${policyTypeId}`);
    if (response.data.success) {
      complaints = response.data.data
        .map((data) => {
          delete data.__v;
          return data;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
    }
    complaints.forEach(async (complaint) => {
      // await new ComplaintTypeModel(complaint).save();
      await ComplaintTypeModel.findByIdAndUpdate(
        { _id: complaint._id },
        complaint,
        { upsert: true, new: true },
      );
    });
    let insComplaints;
    const cacheData = await cache._get(insComplaints);
    if (!cacheData) {
      // complaints = await ComplaintTypeModel.find().lean();
      /* set cache */
      cache._set(insComplaints, JSON.stringify(complaints));
    } else {
      complaints = JSON.parse(cacheData);
      logger.info('From Case....', complaints);
    }
    return responseLib.success(res, 200, complaints, 'All Complaint Types fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
