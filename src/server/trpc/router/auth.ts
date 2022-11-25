import { TRPCError } from '@trpc/server';
import { t, authedProcedure } from '../trpc';

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return 'You are logged in and can see this secret message!';
  }),
  setAdminRole: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'you can set your role only once per account',
      });
    }
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { role: 'ADMIN' },
    });
    return 'Updated role - admin';
  }),
  setShelterWorkerRole: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'you can set your role only once per account',
      });
    }
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { role: 'SHELTER' },
    });
    return 'Updated role - shelter';
  }),
  setAdoptingRole: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'you can set your role only once per account',
      });
    }
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { role: 'ADOPTING' },
    });
    return 'Updated role - adopting';
  }),
});
