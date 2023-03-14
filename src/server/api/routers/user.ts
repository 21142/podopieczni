import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany();
    return allUsers;
  }),
});
