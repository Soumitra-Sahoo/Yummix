import redis from "../config/redis.js";

const CACHE_TTL = 300;

const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (data === null || data === undefined) return null;
    return data;
  } catch (error) {
    console.error(`[Cache] GET failed for key "${key}":`, error.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = CACHE_TTL) => {
  if (value === null || value === undefined) return;

  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error(`[Cache] SET failed for key "${key}":`, error.message);
  }
};

const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`[Cache] DELETE failed for key "${key}":`, error.message);
  }
};

export { CACHE_TTL, getCache, setCache, deleteCache };