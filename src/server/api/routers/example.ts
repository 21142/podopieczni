import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';

import { createTRPCRouter } from '~/server/api/trpc';
import publicProcedure from '../procedures/publicProcedure';

export const exampleRouter = createTRPCRouter({
  expensive: publicProcedure.query(async ({ ctx }) => {
    const remaining = await checkIfRateLimitHasExceeded({
      identifier: ctx.session?.user.id ?? '',
    });
    return `Running an expensive query! You have ${remaining} requests remaining!`;
  }),
});
