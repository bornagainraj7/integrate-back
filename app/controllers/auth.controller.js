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
        userType = 'Advisor';
      }
      const user = new UserModel({
        name,
        email,
        mobile,
        userType,
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
      logger.error(error);
      return responseLib.error(res, 500, null, 'Server error occured, try again later');
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

    if (!userData.isAgreed && !userData.isVerified) {
      throw new Error('not-verified');
    }
    await bcryptjs.compare(password, authData.password);

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

    return responseLib.success(res, 201, user, 'User Logged-in successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'not-verified') {
      return responseLib.error(res, 401, null, 'Please click on the link in your registered email and verify your account to login');
    }
    if (error.message === 'No user found') {
      return responseLib.error(res, 401, null, 'We had error finding the user with the given credentials');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.verifyUser = async (req, res) => {
  const { userId } = req.user;
  const { token } = req.params;
  let userData;
  let decoded;
  const userUpdate = {
    isActive: true,
    isVerified: true,
    isAgreed: true,
    agreedOn: new Date(),
  };
  const authUpdate = {
    isVerified: true,
  };
  try {
    decoded = await tokenLib.verifyToken(token);
    await userLib.updateUserInUsers({ _id: userId, agreedOn: undefined }, userUpdate);
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

    return responseLib.success(res, 200, userData, 'User verified successfully');
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
      return responseLib.success(res, 200, userData, 'User already verified');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.logout = async (req, res) => {
  const { token } = req.user;
  const query = { token };
  const data = { token: '', validUpto: new Date() };
  try {
    await authLib.updateUserInAuth(query, data);
    return responseLib.success(res, 201, null, 'You\'ve Logged out successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.success(res, 500, null, 'Server Error Occurred');
  }
};
