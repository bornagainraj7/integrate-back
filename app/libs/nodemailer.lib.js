const logger = require('tracer').colorConsole();
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
const userLib = require('./user.lib');
const config = require('../../config/config');

const transport = nodemailer.createTransport(postmarkTransport({
  auth: {
    apiKey: '6e2a27f7-db12-4b9b-845e-5bece3b435ed',
  },
}));

exports.signUpEmail = (userData, token) => {
  const mailBody = `Dear <strong>${userData.name}</strong>,<br>
                    Welcome to Insurance Samadhan family, we are delighted to have you on board. Let's build an eco-system which is a win win for all the stakeholders in the industry.
                    We look forward to work with you.<br>
                    <br>
                    Login with your registered email id and your password with which you registered.
                    <br>
                    To verify you account please click on this <a target="_blank" href="${config.frontend}/auth/verify/${token}">link</a>
                    <br>
                    <br>
                    <strong>Note: By clicking on the above link you agree to all our Terms and Conditions.</strong>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    Team Insurance Samadhan<br>
                    Toll Free No: 844-844-0626<br>
                    <strong>The Most trusted platform for resolving insurance complaints in INDIA</strong>`;
  const mailOptions = {
    from: 'corporate@insurancesamadhan.com',
    to: `${userData.email}`,
    cc: 'deepak@insurancesamadhan.com',
    subject: 'Welcome From Insurance Samadhan',
    html: mailBody,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions)
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        logger.error(error);
        return reject(error);
      });
  });
};

exports.leadSubmittedEmail = async (leadData) => {
  let mailOptions;
  const mailBody = `Dear <strong>${leadData.name}</strong>,<br>
                    Your query regarding your Insurace policy was successfully submitted with us, we'll get back to you soon.
                    <br>
                    <br>
                    Team Insurance Samadhan<br>
                    Toll Free No: 844-844-0626<br>
                    <strong>The Most trusted platform for resolving insurance complaints in INDIA</strong>`;

  return new Promise((resolve, reject) => {
    userLib.getSingleUserFromUsers({ _id: leadData.userId })
      .then((userData) => {
        mailOptions = {
          from: 'corporate@insurancesamadhan.com',
          to: `${leadData.email}`,
          cc: `deepak@insurancesamadhan.com, ${userData.email}`,
          subject: 'Query Submitted at Insurance Samadhan',
          html: mailBody,
        };

        return transport.sendMail(mailOptions);
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        logger.error(error);
        reject(error);
      });
  });
};

exports.leadUpdateEmail = () => {

};
