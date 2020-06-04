const jwt = require('jsonwebtoken');
const logger = require('tracer').colorConsole();

const secretKey = '8)m3Ve12y1r4nd0mP455w012d'; // someveryrandomPassword


exports.generateToken = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        jwtId: Date.now(),
        issueDate: new Date(),
        userId: data._id,
        email: data.email,
        mobile: data.mobile,
        name: data.name,
        userType: data.userType,
        userName: data.userName,
      };
      const expiry = {
        expiresIn: '30d',
      };
      const token = jwt.sign(payload, secretKey, expiry);
      resolve(token);
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });
};

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      resolve(decoded);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
};
