import Redis from "ioredis";

const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// Log any Redis client errors
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to the Redis server
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

export default redisClient;
