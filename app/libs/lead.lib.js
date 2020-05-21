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

exports.getLeads = (condition) => {
  return new Promise((resolve, reject) => {
    LeadModel.find(condition)
      .populate('userId')
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
