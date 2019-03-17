const redisClient = require('redis').createClient;
const redis = redisClient(6379, process.env.REDIS_URL);
module.exports.redis = redis;
