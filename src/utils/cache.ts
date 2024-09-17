import NodeCache from "node-cache";
import { promisify } from "util";
import { createClient } from "redis";

const cache = new NodeCache();
const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
const redisSetAsync = promisify(client.set).bind(client);

client.on("error", (err: any) => console.log("Redis Client Error", err));

export const DEFAULT_CACHE_TIME = 1800; // 30 minutes in seconds

export async function getCache(key: string) {
  const redisValue = await client.get(key);
  if (redisValue) {
    console.log("Cache hit! Key:", key);
    return JSON.parse(redisValue);
  } else {
    console.log("Cache miss! Key:", key);
    const nodeCacheValue = cache.get(key);
    if (nodeCacheValue) {
      console.log("Saving to Redis...");
      await redisSetAsync(
        key,
        JSON.stringify(nodeCacheValue),
        "EX",
        DEFAULT_CACHE_TIME
      );
    }
    return nodeCacheValue;
  }
}

export async function setCache(key: string, value: any, ttl?: number) {
  cache.set(key, value, ttl || DEFAULT_CACHE_TIME);
  return redisSetAsync(
    key,
    JSON.stringify(value),
    "EX",
    ttl || DEFAULT_CACHE_TIME
  );
}
