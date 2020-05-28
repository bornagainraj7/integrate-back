require('dotenv').config();
const path = require('path');

const rootPath = path.normalize(path.join(__dirname, '/..'));
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT;
// const dbConnection = process.env.MONGO_CONNECTION;
const appName = 'Insurance-Samadhan';

const config = {
  dev: {
    root: rootPath,
    app: {
      name: appName,
    },
    port: port || 3500,
    db: 'is-dev',
    payment_reminder_key: 1,
    follow_reminder_key: 1,
    payment_job_time: '14:00:00',
    follow_job_time: '05:30:00',
    hearing_job_time: '15:15:00',
    hearing_reminder_key: 1,
    pending_lead_report_key: 1,
    pending_lead_report_time: '11:12:00',
    frontend: 'http://localhost:4200/',
    email: true,
    redis: false,
  },

  stage: {
    root: rootPath,
    app: {
      name: appName,
    },
    port: port || 4500,
    db: 'is-stage',
    payment_reminder_key: 0,
    follow_reminder_key: 1,
    payment_job_time: '14:00:00',
    follow_job_time: '05:30:00',
    hearing_job_time: '05:30:00',
    hearing_reminder_key: 1,
    pending_lead_report_time: '17:15:00',
    pending_lead_report_key: 1,
    frontend: 'http://stage.integrate.insurancesamadhan.com/',
    email: true,
    redis: false,
  },

  prod: {
    root: rootPath,
    app: {
      name: appName,
    },
    port: port || 5500,
    db: 'is-prod',
    payment_reminder_key: 1,
    follow_reminder_key: 1,
    payment_job_time: '14:00:00',
    follow_job_time: '05:30:00',
    hearing_job_time: '05:30:00',
    hearing_reminder_key: 1,
    pending_lead_report_time: '17:15:00',
    pending_lead_report_key: 1,
    frontend: 'http://integrate.insurancesamadhan.com/',
    email: true,
    redis: false,
  },
};

module.exports = config[env];
