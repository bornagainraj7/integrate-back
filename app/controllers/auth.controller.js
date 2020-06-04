const logger = require('tracer').colorConsole();
const bcryptjs = require('bcryptjs');
// const ejs = require('ejs');
const nodemailerLib = require('../libs/nodemailer.lib');
const AuthModel = require('../models/auth.model');
const UserModel = require('../models/user.model');
const responseLib = require('../libs/response.lib');
const tokenLib = require('../libs/token.lib');
const authLib = require('../libs/auth.lib');
const userLib = require('../libs/user.lib');


exports.signupUser = (req, res) => {
  const { body } = req;
  const { email } = body;
  const { password } = body;
  const { name } = body;
  const { mobile } = body;
  let { userType } = body;
  let userData;
  let userToken;
  let hash;


  const createAccount = () => {
    return new Promise((resolve, reject) => {
      if (!userType) {
        userType = 'Vendor';
      }
      const user = new UserModel({
        name,
        email,
        mobile,
        userType,
        userName: `INSA${Date.now()}`,
        isBlocked: false,
        isAgreed: false,
        isActive: false,
        isVerified: false,
      });

      return user.save()
        .then((savedUser) => {
          userData = savedUser;
          resolve(savedUser);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  };

  const generateToken = () => {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    return new Promise((resolve, reject) => {
      bcryptjs.hash(password, 10)
        .then((hashed) => {
          hash = hashed;
          return tokenLib.generateToken(userData);
        })
        .then((token) => {
          userToken = token;
          const { _id } = userData;
          const auth = new AuthModel({
            userId: _id,
            email,
            mobile,
            token,
            password: hash,
            validUpto: now,
            isVerified: false,
            isAuthorized: false,
          });
          return auth.save();
        })
        .then((savedAuth) => {
          resolve(savedAuth);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  };


  (async () => {
    try {
      await createAccount();
      await generateToken();
      await nodemailerLib.signUpEmail(userData, userToken);
      userData = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        userType: userData.userType,
        createdAt: userData.createdAt,
        isBlocked: userData.isBlocked,
        isVerified: userData.isVerified,
        isAgreed: userData.isAgreed,
      };
      return responseLib.success(res, 201, userData, 'Registration successful, please check you registered email address for a confirmation and click on the confirmation link.');
    } catch (error) {
      logger.error(error.name);
      if (error.name === 'ValidationError') {
        return responseLib.error(res, 403, null, 'Please use different email or mobile number');
      }
      return responseLib.error(res, 500, null, 'Server Error Occurred');
    }
  })();
};


exports.loginUser = async (req, res) => {
  const { body } = req;
  const { email } = body;
  const { password } = body;
  let userData;
  let authData;
  let token;
  const now = new Date();

  try {
    userData = await userLib.getSingleUserFromUsers({ email });
    authData = await authLib.getSingleUserFromAuth({ email });

    if (!authData.isVerified) {
      throw new Error('not-verified');
    }

    if (!userData.isVerified) {
      throw new Error('not-allowed');
    }

    if (!userData.isAgreed) {
      throw new Error('not-agreed');
    }

    const compare = await bcryptjs.compare(password, authData.password);
    if (!compare) {
      throw new Error('no-password-match');
    }
    token = await tokenLib.generateToken(userData);
    now.setDate(now.getDate() + 30);
    const data = {
      token,
      validUpto: now,
    };
    await authLib.updateUserInAuth({ userId: userData._id }, data);

    const user = {
      _id: userData._id,
      email: userData.email,
      userType: userData.userType,
      name: userData.name,
      mobile: userData.mobile,
      isBlocked: userData.isBlocked,
      isVerified: userData.isVerified,
      isActive: userData.isActive,
      token: token,
      tokenExpiry: now.getTime(),
    };

    return responseLib.success(res, 201, user, 'User logged-in successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'not-allowed') {
      return responseLib.error(res, 403, null, 'Please allow some time for our team to evaluate your application');
    }

    if (error.message === 'not-verified') {
      return responseLib.error(res, 403, null, 'Please click on the link in your registered email and verify your account to login');
    }

    if (error.message === 'not-agreed') {
      return responseLib.error(res, 403, null, 'Please click on the link in your registered email and agree to our contract to login');
    }

    if (error.message === 'No User found' || error.message === 'no-password-match') {
      return responseLib.error(res, 401, null, 'There was a problem with your email or password');
    }

    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.verifyUser = async (req, res) => {
  const { userId } = req.user;
  const { token } = req.params;
  // eslint-disable-next-line
  let userData;
  let decoded;
  const userUpdate = {
    isActive: true,
  };
  const authUpdate = {
    isVerified: true,
  };
  try {
    decoded = await tokenLib.verifyToken(token);
    await userLib.updateUserInUsers({ _id: userId }, userUpdate);
    await authLib.updateUserInAuth({ userId }, authUpdate);
    const issueDate = new Date(decoded.jwtId);
    issueDate.setDate(issueDate.getDate() + 30);

    userData = {
      _id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
      name: decoded.name,
      mobile: decoded.mobile,
      token: token,
      tokenExpiry: issueDate.getTime(),
    };

    return responseLib.success(res, 200, null, 'User verified successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'No user modified in Auth' || error.message === 'No user modified in User') {
      const issueDate = new Date(decoded.jwtId);
      issueDate.setDate(issueDate.getDate() + 30);

      userData = {
        _id: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
        name: decoded.name,
        mobile: decoded.mobile,
        token: token,
        tokenExpiry: issueDate.getTime(),
      };
      return responseLib.success(res, 200, null, 'User already verified');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.signContract = async (req, res) => {
  const { userId } = req.params || req.query;
  const userUpdate = {
    isAgreed: true,
    agreedOn: new Date(),
  };

  try {
    await userLib.updateUserInUsers({ _id: userId }, userUpdate);

    return responseLib.success(res, 200, null, 'You\'ve successfully signed our contract');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.authorize = async (req, res) => {
  const { userId } = req.params || req.query;
  const userUpdate = { isVerified: true };
  const authUpdate = { isAuthorized: true };

  try {
    const userData = await userLib.getSingleUserFromUsers({ _id: userId });
    await userLib.updateUserInUsers({ _id: userId }, userUpdate);
    await authLib.updateUserInAuth({ userId }, authUpdate);

    await nodemailerLib.accountAuthorizeEmail(userData);
    return responseLib.success(res, 200, null, 'User is now authorized and can login');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.logout = async (req, res) => {
  const token = req.user.token || req.query.token || req.params.token;
  const query = { token };
  const data = { token: '', validUpto: new Date() };
  try {
    await authLib.updateUserInAuth(query, data);
    return responseLib.success(res, 200, null, 'You\'ve logged out successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.success(res, 500, null, 'Server Error Occurred');
  }
};
