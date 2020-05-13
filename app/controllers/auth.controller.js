const logger = require('tracer').colorConsole();
const bcryptjs = require('bcryptjs');
const AuthModel = require('../models/auth.model');
const UserModel = require('../models/user.model');
const response = require('../libs/response.lib');
const tokenLib = require('../libs/token.lib');
const authLib = require('../libs/auth.lib');
const userLib = require('../libs/user.lib');


exports.signupUser = (req, res) => {
  const { body } = req;
  const { email } = body;
  const { password } = body;
  const { firstName } = body;
  const { lastName } = body;
  const { mobile } = body;
  const { userType } = body;
  let userData;
  let userToken;
  let hash;


  const createAccount = () => {
    return new Promise((resolve, reject) => {
      const user = new UserModel({
        firstName,
        lastName,
        email,
        mobile,
        userType,
      });

      return user.save()
        .then((savedUser) => {
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
            _id,
            email,
            mobile,
            password: hash,
            token,
            now,
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
      userData.token = userToken;
      return response.success(res, 201, userData, 'User created successfully');
    } catch (error) {
      logger.error(error);
      return response.error(res, 500, null, 'Server error occured, try again later');
    }
  })();
};


exports.loginUser = async (req, res) => {
  const { body } = req;
  const { email } = body;
  const { password } = body;
  let userData;
  let token;
  const now = new Date();

  try {
    userData = await authLib.getSingleUserFromAuth({ email });
    await bcryptjs.compare(password, userData.password);
    const user = await userLib.getSingleUserFromUsers({ email });

    const time = now.getTime();
    const expiry = new Date(userData.validUpto).getTime() - 60000;
    if (time > expiry) {
      token = await tokenLib.generateToken(user);
      now.setDate(now.getDate() + 30);
      const data = {
        token,
        validUpto: now,
      };
      await authLib.updateUserInAuth({ _id: userData._id }, data);
    } else {
      token = userData.token;
    }

    user.token = token;
    return response.success(res, 201, user, 'User Logged-in successfully');
  } catch (error) {
    logger.error(error);
    return response.error(res, 500, null, 'Server Error Occurred');
  }
};
