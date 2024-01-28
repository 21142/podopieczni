import { describe, expect, it, vi } from 'vitest';
import { checkIfRateLimitHasExceeded } from './checkRateLimit';

import { rateLimiter } from './rateLimit';

export type RatelimitResponse = {
  limit: number;
  remaining: number;
  reset: number;
  success: boolean;
  pending: Promise<unknown>;
};

vi.mock('./rateLimit', () => ({
  rateLimiter: vi.fn(),
}));

describe('checkIfRateLimitHasExceeded', () => {
  it('should use the specified rate limiter', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mockUrl';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mockToken';
    vi.mocked(rateLimiter)
      .mockReturnValueOnce(() =>
        Promise.resolve({
          limit: 10,
          remaining: 5,
          reset: Date.now() + 10000,
        } as RatelimitResponse)
      )
      .mockReturnValueOnce(() =>
        Promise.resolve({
          limit: 20,
          remaining: 15,
          reset: Date.now() + 10000,
        } as RatelimitResponse)
      );

    const identifier = 'test-ip';
    const mainRateLimiterName = 'main';
    const adminRateLimiterName = 'admin';

    await expect(
      checkIfRateLimitHasExceeded({
        rateLimiterName: mainRateLimiterName,
        identifier,
      })
    ).resolves.toBe(5);
    await expect(
      checkIfRateLimitHasExceeded({
        rateLimiterName: adminRateLimiterName,
        identifier,
      })
    ).resolves.toBe(15);
  });

  it('should return the amount of remaining requests if rate limit is not exceeded', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mockUrl';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mockToken';
    vi.mocked(rateLimiter).mockReturnValue(() => {
      return Promise.resolve({
        limit: 10,
        remaining: 5,
        reset: Date.now() + 10000,
      } as RatelimitResponse);
    });

    const identifier = 'test-ip';
    const rateLimiterName = 'main';

    await expect(
      checkIfRateLimitHasExceeded({ rateLimiterName, identifier })
    ).resolves.toBe(5);
  });

  it('should not throw an error if rate limit is not exceeded', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mockUrl';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mockToken';
    vi.mocked(rateLimiter).mockReturnValue(() => {
      return Promise.resolve({
        limit: 10,
        remaining: 5,
        reset: Date.now() + 10000,
      } as RatelimitResponse);
    });

    const identifier = 'test-ip';

    await expect(
      checkIfRateLimitHasExceeded({ identifier })
    ).resolves.not.toThrow();
  });

  it('should throw an error if rate limit is exceeded', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mockUrl';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mockToken';

    vi.mocked(rateLimiter).mockReturnValue(() => {
      return Promise.resolve({
        limit: 10,
        remaining: -1,
        reset: Date.now() + 10000,
      } as RatelimitResponse);
    });

    const identifier = 'test-ip';

    await expect(checkIfRateLimitHasExceeded({ identifier })).rejects.toThrow();
  });
});
