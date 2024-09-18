import NodeCache from "node-cache";
import redisClient from "./redis";

const cache = new NodeCache();

export const DEFAULT_CACHE_TIME = 1800; // 30 minutes in seconds

export async function getCache(key: string) {
  try {
    const redisValue = await redisClient.get(key);
    if (redisValue) {
      console.log("Cache hit! Key:", key);
      return JSON.parse(redisValue);
    } else {
      console.log("Cache miss! Key:", key);
      const nodeCacheValue = cache.get(key);
      if (nodeCacheValue) {
        console.log("Saving to Redis...");
        await redisClient.set(
          key,
          JSON.stringify(nodeCacheValue),
          "EX",
          DEFAULT_CACHE_TIME
        );
      }
      return nodeCacheValue;
    }
  } catch (err) {
    console.error("Redis Get Error:", err);
    return null;
  }
}

export async function setCache(key: string, value: any, ttl?: number) {
  try {
    cache.set(key, value, ttl || DEFAULT_CACHE_TIME);
    return await redisClient.set(
      key,
      JSON.stringify(value),
      "EX",
      ttl || DEFAULT_CACHE_TIME
    );
  } catch (err) {
    console.error("Redis Set Error:", err);
    return null;
  }
}
