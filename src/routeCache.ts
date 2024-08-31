// const { notDeepEqual } = require('assert');
import NodeCache from 'node-cache';

const cache = new NodeCache();

export default (duration: number) => (req: any, res: any, next: any) => {
  // is request a GET?
  if (req.method !== 'GET') {
    return next();
  }
  // if not, call next
  const key = req.originalUrl || req.url;
  const cacheResponse = cache.get<string>(key); // Explicitly specify the type as string
  // check if key exists in cache
  if (cacheResponse !== undefined) {
    // if it exists, return the value
    res.send(JSON.parse(cacheResponse));
  } else {
    // if not, replace the value with the result of the next function
    const originalSend = res.send;
    res.send = (body: any) => {
      originalSend.call(res, body);
      cache.set(key, JSON.stringify(body), duration);
    };
    next();
  }
};
