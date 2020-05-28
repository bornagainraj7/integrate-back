const logger = require('tracer').colorConsole();
const LeadModel = require('../models/lead.model');

exports.count = (condition) => {
  return new Promise((resolve, reject) => {
    LeadModel.countDocuments(condition)
      .then((count) => {
        resolve(count);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getLeads = (condition, page, size) => {
  return new Promise((resolve, reject) => {
    LeadModel.find(condition)
      .populate('userId')
      .populate('policyTypeId')
      .populate('complaintTypeId')
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size)
      .lean()
      .then((results) => {
        resolve(results);
      })
      .catch((error) => {
        logger.error(error);
        reject(error);
      });
  });
};

exports.getSingleLead = (leadId) => {
  return new Promise((resolve, reject) => {
    LeadModel.findById(leadId)
      .populate('userId')
      .populate('policyTypeId')
      .populate('complaintTypeId')
      .lean()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        logger.error(error);
        reject(error);
      });
  });
};

exports.getLeadsCount = (condition) => {
  return new Promise((resolve, reject) => {
    LeadModel.countDocuments(condition)
      .then((count) => {
        logger.info(count);
        resolve(count);
      })
      .catch((error) => {
        logger.error(error);
        reject(error);
      });
  });
};


exports.updateLead = (query, data) => {
  return new Promise((resolve, reject) => {
    LeadModel.updateOne(query, data)
      .then((result) => {
        if (result.nModified > 0) {
          resolve('updated');
        }
        reject(new Error('No lead modified'));
      })
      .catch((error) => {
        logger.error(error);
        reject(error);
      });
  });
};
