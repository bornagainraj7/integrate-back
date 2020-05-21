const logger = require('tracer').colorConsole();
const tokenLib = require('../libs/token.lib');
const responseLib = require('../libs/response.lib');

exports.isAuthorised = (req, res, next) => {
  let token;
  if (req.header('Authorization')) {
    const bearerHeader = req.header('Authorization');
    const bearer = bearerHeader.split(' ');
    [, token] = bearer;
  } else {
    token = req.query.authorization || req.params.authorization || req.body.authorization;
  }

  if (token) {
    tokenLib.verifyToken(token)
      .then((decoded) => {
        req.user = {
          ...decoded,
        };
        return next();
      })
      .catch((error) => {
        logger.error(error);
        return responseLib.error(res, 401, null, 'Error while verifying Authtoken');
      });
  } else {
    return responseLib.error(res, 401, null, 'No Auth token found');
  }
};


exports.verifyFirstTime = (req, res, next) => {
  const { token } = req.params;
  if (token) {
    tokenLib.verifyToken(token)
      .then((decoded) => {
        req.user = {
          ...decoded,
        };
        return next();
      })
      .catch((error) => {
        logger.error(error);
        return responseLib.error(res, 401, null, 'Error while verifying Authtoken');
      });
  } else {
    return responseLib.error(res, 401, null, 'No Auth token found');
  }
};
