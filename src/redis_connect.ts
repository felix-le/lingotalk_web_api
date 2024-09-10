import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Extract necessary environment variables for Redis configuration
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// Handle Redis client connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

export default redisClient;