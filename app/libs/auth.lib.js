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
  return new Promise((resolve, reject) => {
    AuthModel.updateOne(query, data)
      .then((result) => {
        if (result.n > 1) {
          resolve('Updated');
        } else {
          reject(new Error('No user modified'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
