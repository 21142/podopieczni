import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type RateLimitArgs = {
  rateLimiterName?: 'main' | 'admin';
  identifier: string;
};

export function rateLimiter() {
  const redis = Redis.fromEnv();
  const limiter = {
    main: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, '60s'),
      analytics: true,
      prefix: 'ratelimit',
    }),
    admin: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(20, '60s'),
      analytics: true,
      prefix: 'ratelimit:admin',
    }),
  };

  async function rateLimit({
    rateLimiterName = 'main',
    identifier,
  }: RateLimitArgs) {
    return await limiter[rateLimiterName].limit(identifier);
  }

  return rateLimit;
}

export type RatelimitResponse = ReturnType<ReturnType<typeof rateLimiter>>;
