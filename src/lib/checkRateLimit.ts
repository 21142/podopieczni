import { TRPCError } from '@trpc/server';
import type { RateLimitArgs } from './rateLimit';
import { rateLimiter } from './rateLimit';

export async function checkIfRateLimitHasExceeded({
  rateLimiterName = 'main',
  identifier,
}: RateLimitArgs) {
  const { remaining, reset } = await rateLimiter()({
    rateLimiterName,
    identifier,
  });

  if (remaining < 1) {
    const secondsToWait = Math.floor((reset - Date.now()) / 1000);
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${secondsToWait} seconds.`,
    });
  }

  return remaining;
}
