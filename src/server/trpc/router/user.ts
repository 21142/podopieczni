import { t, authedProcedure } from '../trpc';

export const userRouter = t.router({
  me: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  hasRole: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: { role: ctx.session.user.role ? true : false },
    });
    return user;
  }),
});
