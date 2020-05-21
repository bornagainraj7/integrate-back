const ioredis = require('ioredis');

/*
 * Set the default expiry to 1 day
 */
const default_expiry = 1 * 24 * 60 * 60;

class Cache {
  constructor(options) {
    if (!options) throw new Error('no options specified while instantiating cache');

    if (!options.namespace) throw new Error('no "namespace" specified while instantiating cache');

    this.expiry = options.expiry || default_expiry;
    this.namespace = options.namespace;

    /*
     * Connect to REDIS
     */
    this._init();
  }

  _init() {
    /*
     * Connect to REDIS
     */
    this.redis = new ioredis({
      retryStrategy: function (times) {
        return Math.min(times * 1000, 10000);
      },
      keyPrefix: this.namespace,
    });

    this.redis.on('connect', () => {
      console.log('redis connection ok');
    });

    this.redis.on('error', (err) => {
      console.log({ err }, 'redis connection error');
    });

    this.redis.on('close', () => {
      console.log('redis connection closed');
    });
    this.redis.on('reconnecting', () => {
      console.log('redis reconnecting ...');
    });
  }

  _set(key, val) {
    return this.redis.set(key, val, 'EX', this.expiry);
  }

  _get(key) {
    return this.redis.get(key);
  }

  _del(key) {
    return this.redis.del(key);
  }
}

module.exports = Cache;
