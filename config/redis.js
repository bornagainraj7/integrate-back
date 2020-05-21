const redis = require('redis');
const logger = require('tracer').colorConsole();

// setup port constants
const portRedis = process.env.PORT || 6379;

// configure redis client on port 6379
const redisClient = redis.createClient(portRedis);

redisClient.on('connect', () => {
  logger.info('Connected to redis database');
});

module.exports = redisClient;
