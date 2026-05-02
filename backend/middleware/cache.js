'use strict';

const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Create a cache middleware with a given TTL (seconds).
 * The cache key is the full request URL.
 */
function cacheMiddleware(ttl) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached !== undefined) {
      return res.json(cached);
    }
    // Intercept res.json to store in cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttl);
      return originalJson(data);
    };
    next();
  };
}

function clearCache(pattern) {
  const keys = cache.keys();
  const toDelete = pattern
    ? keys.filter((k) => k.includes(pattern))
    : keys;
  toDelete.forEach((k) => cache.del(k));
  return toDelete.length;
}

module.exports = { cache, cacheMiddleware, clearCache };
