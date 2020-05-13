const logger = require('tracer').colorConsole();
const tokenLib = require('../libs/token.lib');
const response = require('../libs/response.lib');

exports.isAuthorised = (req, res, next) => {
  let token;
  if (req.header('Authorization')) {
    const bearerHeader = req.header('Authorization');
    const bearer = bearerHeader.split(' ');
    [, token] = bearer;
  } else {
    token = req.query.authToken || req.params.authToken || req.body.authToken;
  }

  if (token) {
    tokenLib.verifyToken(token)
      .then((decoded) => {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          mobile: decoded.mobile,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          userType: decoded.userType,
        };
        next();
      })
      .catch((error) => {
        logger.error(error);
        return response.error(res, 401, null, 'Error while verifying Authtoken');
      });
  } else {
    return response.error(res, 401, null, 'No Auth token found');
  }
};
