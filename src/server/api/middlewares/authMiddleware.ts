import { TRPCError } from '@trpc/server';
import { Roles } from '~/lib/constants';
import { t } from '../trpc';

/** Reusable middleware that enforces users are logged in before running the procedure. */
export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const isAdmin = isAuthed.unstable_pipe(({ ctx, next }) => {
  if (ctx.session.user.role !== Roles.Admin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
