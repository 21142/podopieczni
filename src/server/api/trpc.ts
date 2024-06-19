import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '~/lib/auth';
import { prisma } from '~/lib/db';

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
