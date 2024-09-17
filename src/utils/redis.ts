import {Redis} from 'ioredis';
//  redis-cli FLUSHALL for remove all keys
//  redis-cli KEYS '*'  for getting all keys
const redisClient = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379',
);

// Log any Redis client errors
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to the Redis server
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Export the Redis client
export default redisClient;
