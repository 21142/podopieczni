import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';

import { createTRPCRouter } from '~/server/api/trpc';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),

  expensive: protectedProcedure.query(async ({ ctx }) => {
    const remaining = await checkIfRateLimitHasExceeded({
      rateLimiterName: 'main',
      identifier: ctx.session?.user.id ?? '',
    });
    return `Running an expensive query! You have ${remaining} requests remaining!`;
  }),
});
