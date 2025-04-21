/**
 * Rate limiter functionality using Upstash Redis
 * Limits users to 10 requests per day
 */

import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
let redis: Redis;

try {
  redis = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || '',
  });
} catch (error) {
  console.error('Failed to initialize Upstash Redis:', error);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  error?: string;
}

/**
 * Check if a user has exceeded their rate limit
 * @param identifier User identifier (IP address, session ID, etc.)
 * @returns RateLimitResult object
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!redis) {
    console.warn('Rate limiting is disabled: Upstash Redis not configured');
    // If Redis isn't configured, allow the request but log a warning
    return {
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(Date.now() + 24 * 60 * 60 * 1000),
      error: 'Rate limiting is disabled'
    };
  }
  
  try {
    // Create a unique key for this user
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `rate_limit:${identifier}:${today}`;
    
    // Get current count
    const currentCount = await redis.get<number>(key) || 0;
    
    // Check if user has exceeded limit
    const limit = 10; // 10 requests per day
    const remaining = Math.max(0, limit - currentCount);
    const success = currentCount < limit;
    
    // Calculate reset time (end of the current day)
    const reset = new Date();
    reset.setHours(23, 59, 59, 999);
    
    if (success) {
      // Increment the counter
      await redis.incr(key);
      
      // Set expiry to end of day if not already set
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        // Calculate seconds until end of day
        const secondsUntilEndOfDay = Math.floor((reset.getTime() - Date.now()) / 1000);
        await redis.expire(key, secondsUntilEndOfDay);
      }
    }
    
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // On error, allow the request but log the error
    return {
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(Date.now() + 24 * 60 * 60 * 1000),
      error: 'Rate limit check failed'
    };
  }
} 