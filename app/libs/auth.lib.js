const logger = require('tracer').colorConsole();
const AuthModel = require('../models/auth.model');


exports.getSingleUserFromAuth = (condition) => {
  return new Promise((resolve, reject) => {
    AuthModel.findOne(condition)
      .lean()
      .then((user) => {
        if (!user) {
          reject(new Error('No User found'));
        } else {
          resolve(user);
        }
      })
      .catch((error) => {
        logger.error(error);
        reject(new Error(error));
      });
  });
};

exports.updateUserInAuth = (query, data) => {
  logger.info(query);
  logger.info(data);
  return new Promise((resolve, reject) => {
    AuthModel.updateOne(query, data)
      .then((result) => {
        if (result.nModified > 0) {
          resolve('Updated');
        } else {
          reject(new Error('No user modified in Auth'));
        }
      })
      .catch((error) => {
        logger.erro(error);
        reject(error);
      });
  });
};
