import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ Upstash Redis environment variables are missing. Cache features will be disabled.");
  }
}

// Basic proxy to add hit/miss logging
const redisWithLogging = new Proxy(new Redis({
  url: redisUrl || "https://placeholder-url.upstash.io",
  token: redisToken || "placeholder-token",
}), {
  get(target, prop, receiver) {
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === 'function' && ['get', 'hget', 'json.get'].includes(prop as string)) {
      return async (...args: any[]) => {
        try {
          const result = await val.apply(target, args);
          console.log(`[Redis] ${prop as string} ${result ? 'HIT' : 'MISS'}: ${args[0]}`);
          return result;
        } catch (e) {
          console.warn(`[Redis] ${prop as string} ERROR:`, e);
          return null;
        }
      };
    }
    return val;
  }
});

export const redis = redisWithLogging;

export const CACHE_KEYS = {
  PROJECT_STATS: (userId: string) => `studio:${userId}:stats`,
  PROJECT_METADATA: (slug: string) => `project:${slug}:meta`,
};
