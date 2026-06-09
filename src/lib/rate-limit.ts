interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  interval: number; // in milliseconds
  maxRequests: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + options.interval };
    return { success: true, remaining: options.maxRequests - 1, resetTime: store[key].resetTime };
  }

  const record = store[key];

  // Reset if interval has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + options.interval;
    return { success: true, remaining: options.maxRequests - 1, resetTime: record.resetTime };
  }

  // Check if limit exceeded
  if (record.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function getRateLimitHeaders(result: ReturnType<typeof rateLimit>) {
  return {
    'X-RateLimit-Limit': '5',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}
