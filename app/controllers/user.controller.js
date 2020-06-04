const logger = require('tracer').colorConsole();
const userLib = require('../libs/user.lib');
const responseLib = require('../libs/response.lib');

exports.getSingleUser = async (req, res) => {
  logger.info();
  const { userId } = req.params || req.query;

  try {
    const userData = await userLib.getSingleUserFromUsers({ _id: userId });

    return responseLib.success(res, 200, userData, 'User details fetched successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'No User found') {
      return responseLib.error(res, 404, null, 'User was not found on our records');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.updateProfile = async (req, res) => {
  const { body } = req;
  const userId = req.user;

  delete body.name;
  delete body.userName;
  delete body.mobile;
  delete body.email;
  delete body.userType;
  delete body.isBlocked;
  delete body.isActive;
  delete body.isVerified;
  delete body.isAgreed;
  delete body.agreedOn;
  delete body.createdAt;

  logger.info(body);
  try {
    await userLib.updateUserInUsers({ _id: userId }, body);

    return responseLib.success(res, 200, null, 'User updated successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'No user modified in User') {
      return responseLib.error(res, 404, null, 'Couldn\'t find user data');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.updateProfilePic = async (req, res) => {
  if (req.fileValidationError) {
    return responseLib.error(res, 415, null, 'File type not supported, please try .jpg, .jpeg, .png');
  }

  const { userId } = req.user;

  const files = req.files[0];
  const fileName = files.filename;
  try {
    logger.info(files);

    const userUpdate = { profilePic: fileName };

    await userLib.updateUserInUsers({ _id: userId }, userUpdate);

    return responseLib.success(res, 201, null, 'Profile pic updated successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};
