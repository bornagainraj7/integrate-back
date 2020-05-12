const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const logger = require('tracer').colorConsole();

const app = express();
const MONGODB_URI = 'mongodb://127.0.0.1:27017/InsuranceSamadhan';

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set Headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authToken, Authorization');
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

const port = normalizePort(process.env.PORT || 3000);
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
  mongoose.connect(MONGODB_URI,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info('Database connected successfully');
    })
    .catch((err) => logger.error(err));
};


// Routes


app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
