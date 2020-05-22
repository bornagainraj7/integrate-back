const logger = require('tracer').colorConsole();
const tokenLib = require('../libs/token.lib');
const responseLib = require('../libs/response.lib');
const authLib = require('../libs/auth.lib');

exports.isAuthorised = (req, res, next) => {
  let token;
  let decoded;
  if (req.header('Authorization')) {
    const bearerHeader = req.header('Authorization');
    const bearer = bearerHeader.split(' ');
    [, token] = bearer;
  } else {
    token = req.query.authorization || req.params.authorization || req.body.authorization;
  }

  if (token) {
    tokenLib.verifyToken(token)
      .then((result) => {
        decoded = result;
        return authLib.getSingleUserFromAuth({ token });
      })
      .then(() => {
        req.user = {
          ...decoded,
          token,
        };
        return next();
      })
      .catch((error) => {
        logger.error(error);
        if (error.message === 'No User found') {
          return responseLib.error(res, 401, null, 'It seems like you need to login first');
        }
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
          token,
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

exports.logout = (req, res, next) => {
  let token;
  if (req.header('Authorization')) {
    const bearerHeader = req.header('Authorization');
    const bearer = bearerHeader.split(' ');
    [, token] = bearer;
  } else {
    token = req.query.authorization || req.params.authorization || req.body.authorization;
  }
  req.user = {
    token,
  };
  next();
};
