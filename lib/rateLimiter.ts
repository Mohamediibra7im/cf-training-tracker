import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter for login attempts (5 attempts per minute per IP)
export const loginLimiter = new RateLimiterMemory({
  points: 5, // Number of login attempts allowed
  duration: 60, // Per 60 seconds (1 minute)
  blockDuration: 180, // Block for 3 minutes if exceeded
});

export async function rateLimitRequest(identifier: string, limiter: RateLimiterMemory) {
  try {
    await limiter.consume(identifier);
    return { success: true };
  } catch (error) {
    // If rate limit is exceeded
    const remainingSeconds = Math.round((error as { msBeforeNext: number }).msBeforeNext / 1000) || 1;
    return {
      success: false,
      remainingSeconds,
    };
  }
}
