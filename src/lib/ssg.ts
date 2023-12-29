import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { prisma } from './db';

export const ssghelpers = createServerSideHelpers({
  router: appRouter,
  ctx: { prisma, session: null },
  transformer: superjson,
});
