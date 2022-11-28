import { TRPCError } from '@trpc/server';
import { Roles } from 'src/server/common/roles';
import { t, authedProcedure } from '../trpc';

export const authRouter = t.router({
  getSecretMessage: authedProcedure.query(() => {
    return 'You are logged in and can see this secret message!';
  }),
  getSession: authedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
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
      data: { role: Roles.Shelter },
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
      data: { role: Roles.Adopter },
    });
    return 'Updated role - adopting';
  }),
});
