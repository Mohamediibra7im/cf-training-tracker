import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 120,
});

export async function rateLimit(request: NextRequest) {
  const ip =
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";
  try {
    await rateLimiter.consume(ip);
    return null;
  } catch (err: unknown) {
    const msBeforeNext =
      typeof err === "object" && err !== null && "msBeforeNext" in err
        ? (err as { msBeforeNext?: number }).msBeforeNext
        : undefined;
    const retrySecs = Math.ceil(msBeforeNext ? msBeforeNext / 1000 : 1);
    const res = NextResponse.json(
      {
        message: `You have made too many requests. Please wait ${retrySecs} seconds and try again.`,
        retryAfter: retrySecs
      },
      {
        status: 429,
        headers: { "Retry-After": retrySecs.toString() }
      }
    );
    return res;
  }
}
