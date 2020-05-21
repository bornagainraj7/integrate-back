const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
<<<<<<< HEAD
const path = require('path');
=======

>>>>>>> work on redis cache
// const csrf = require('csurf');
const bodyParser = require('body-parser');
const logger = require('tracer').colorConsole();
const config = require('./config/config');
const authRoutes = require('./app/routes/auth.routes');
const leadRoutes = require('./app/routes/lead.routes');
const complaintTypeRoutes = require('./app/routes/complaintType.routes');
const insuranceCompanyRoutes = require('./app/routes/insuranceCompany.routes');
const policyTypeRoutes = require('./app/routes/policyType.routes');
const userRoutes = require('./app/routes/user.routes');

const app = express();
const MONGODB_URI = `mongodb://127.0.0.1:27017/${config.db}`;

// const csrfProtection = csrf();
// app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

<<<<<<< HEAD

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Static access
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/apidocs', express.static(path.join(__dirname, '/apidoc')));


=======
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

>>>>>>> work on redis cache
// Set Headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route logger
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(config.port);
const server = http.createServer(app);

const onError = (error) => {
  const addr = server.address();
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}`;
  switch (error.code) {
    case 'EACCESS':
      logger.error(`${bind} requires elevated priveleges`);
      return process.exit(1);
    case 'EASSRINUSE':
      logger.error(`${bind} is already in use`);
      return process.exit(1);
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}`;
  logger.info(`Listening on ${bind}`);
  mongoose
    .connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info('Database connected successfully');
    })
    .catch((err) => logger.error(err));
};

// ejs
app.set('view engine', 'ejs');

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/lead', leadRoutes);
app.use('/api/v1/ins-comp', insuranceCompanyRoutes);
app.use('/api/v1/com-type', complaintTypeRoutes);
app.use('/api/v1/policy-type', policyTypeRoutes);
app.use('/api/v1/user', userRoutes);

app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
