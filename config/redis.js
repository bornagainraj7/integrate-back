const redis = require('redis');

// setup port constants
const portRedis = process.env.PORT || 6379;

// configure redis client on port 6379
const redisClient = redis.createClient(portRedis);

redisClient.on('connect', (err, response) => {
  console.log('Connected to redis database');
});

module.exports = redisClient;
