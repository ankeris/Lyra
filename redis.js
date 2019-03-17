const redisClient = require('redis').createClient;
const redis = redisClient({host: process.env.REDIS_URL});
module.exports.redis = redis;
