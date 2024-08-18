const redis = require("redis");

let redisClient;

const connectRedis = async () => {
  if (!redisClient) {
    try {
      redisClient = redis.createClient();
      await redisClient.connect();
      console.log("Connected to Redis");
    } catch (error) {
      console.error("Redis connection error:", error);
      throw error;
    }
  }
  return redisClient;
};

const getRedisClient = async () => {
  if (!redisClient) {
    await connectRedis();
  }
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };
