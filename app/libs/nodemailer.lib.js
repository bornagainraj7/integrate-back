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
  logger.info();
  const mailBody = `Dear <strong>${userData.name}</strong>,<br>
                    Greetings from Insurance Samadhan<br><br>
                    Welcome to INDIA's most trusted platform for resolving insurance complaints. Thank you for your intereset in joining us. Please allow our team to get back to you in 48 hours.
                    <br>
                    <br>
                    To verify you email please click on this <a target="_blank" href="${config.frontend}/auth/verify/${token}">link</a>
                    <br>
                    NOTE: If you haven't verified your email we won't be able to move ahead with your application. Please verify your email first.
                    <br>
                    <br>
                    In the meantime, if you wish to know more about us. Please check:<br>
                    Website: <a target="_blank" href="https://www.insuranccesamadhan.com">https://www.insuranccesamadhan.com</a><br>
                    Youtube Channel: <a target="_blank" href="https://www.youtube.com/channel/UCnlbMVTuDrZq97QNDfnCKwA">https://www.youtube.com/channel/UCnlbMVTuDrZq97QNDfnCKwA</a><br>
                    Facebook Page: <a target="_blank" href="https://www.facebook.com/insurancesamadhan/">https://www.facebook.com/insurancesamadhan/</a><br>
                    Twitter Handle: <a target="_blank" href="https://twitter.com/InsuranceSamad1">https://twitter.com/InsuranceSamad1</a><br>
                    Quora Account: <a target="_blank" href="https://www.quora.com/profile/Insurance-Samadhan-1">https://www.quora.com/profile/Insurance-Samadhan-1</a><br>
                    Instagram Profile: <a target="_blank" href="https://www.instagram.com/insurancesamadhan/">https://www.instagram.com/insurancesamadhan/</a><br>
                    Linkedin: <a target="_blank" href="https://www.linkedin.com/company/insurancesamadhan/">https://www.linkedin.com/company/insurancesamadhan/</a><br>
                    <br>
                    Regards,<br>
                    Deepak Bhuvneshwari Uniyal<br>
                    Co-Founder & CEO<br>
                    (+91) 98 11 66 79 70<br>
                    <br>
                    <strong>The Most trusted platform for resolving insurance complaints in INDIA</strong>`;
  const mailOptions = {
    from: 'corporate@insurancesamadhan.com',
    to: `${userData.email}`,
    // cc: 'deepak@insurancesamadhan.com',
    subject: 'Welcome From Insurance Samadhan',
    html: mailBody,
  };

  return new Promise((resolve, reject) => {
    // if (config.env !== 'dev') {
    transport.sendMail(mailOptions)
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        logger.error(error);
        return reject(error);
      });
    // }
  });
};


exports.accountAuthorizeEmail = async (userData) => {
  const mailBody = `Dear <strong>${userData.name}</strong>,<br>
                    Greetings from Insurance Samadhan<br><br>
                    Welcome to INDIA's most trusted platform for resolving insurance complaints.
                    We welcome you as our trusted partner in making the Insurance ecosystem better.
                    <br>
                    <br>
                    First step for moving ahead is to sign a contract before starting your journey with us. It is a mandatory step to move forward.
                    You can find your contract <a target="_blank" href="${config.frontend}/user/contract/${userData._id}">here</a>.
                    <br>
                    <br>
                    One you've signed contract you can login to our portal using your acccount details.
                    <br>
                    <br>
                    URL: <a target="_blank" href="${config.frontend}/auth/login">Login</a><br>
                    Email: your registered email<br>
                    Password: your registered password<br>
                    <br>
                    In case of any issues or clarifications, please feel free to connect with me.<br>
                    Looking forward to a great journey with you.<br>
                    <br>
                    Regards,<br>
                    Deepak Bhuvneshwari Uniyal<br>
                    Co-Founder & CEO<br>
                    (+91) 98 11 66 79 70<br>
                    <br>
                    <strong>The Most trusted platform for resolving insurance complaints in INDIA</strong>`;
  const mailOptions = {
    from: 'corporate@insurancesamadhan.com',
    to: `${userData.email}`,
    // cc: 'deepak@insurancesamadhan.com',
    subject: 'Account Confirmation',
    html: mailBody,
  };

  return new Promise((resolve, reject) => {
    // if (config.env !== 'dev') {
    transport.sendMail(mailOptions)
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        logger.error(error);
        return reject(error);
      });
    // }
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
    // if (config.env !== 'dev') {
    userLib.getSingleUserFromUsers({ _id: leadData.userId })
      .then((userData) => {
        mailOptions = {
          from: 'corporate@insurancesamadhan.com',
          to: `${leadData.email}`,
          cc: `${userData.email}`,
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
    // }
  });
};

exports.leadUpdateEmail = () => {

};
