import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { Roles } from '~/utils/constants';

export const authRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return 'You are logged in and can see this secret message!';
  }),
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),
  setShelterWorkerRole: protectedProcedure.mutation(async ({ ctx }) => {
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
  setAdoptingRole: protectedProcedure.mutation(async ({ ctx }) => {
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
