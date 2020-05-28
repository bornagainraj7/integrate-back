const logger = require('tracer').colorConsole();
const UserModel = require('../models/user.model');


exports.getSingleUserFromUsers = (condition) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(condition)
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

exports.updateUserInUsers = (query, data) => {
  return new Promise((resolve, reject) => {
    UserModel.updateOne(query, data)
      .then((result) => {
        if (result.nModified > 0) {
          resolve('Updated');
        } else {
          reject(new Error('No user modified in User'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
