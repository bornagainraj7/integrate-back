const redis = require('redis');
const logger = require('tracer').colorConsole();

const RedisPort = process.env.PORT || 6379;
const client = redis.createClient(RedisPort);

client.on('connect', () => {
  logger.info('Redis connected successfully');
});
