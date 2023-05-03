import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';
import { userAccountDetailsSchema } from '~/utils/validation/user';

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        address: true,
      },
    });
    return user;
  }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany({
      include: {
        address: true,
      },
    });
    return allUsers;
  }),
  add: adminProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.create({
        data: {
          name: `${input.firstName} ${input.lastName}`,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          dateOfBirth: new Date(input.dateOfBirth),
          phoneNumber: input.phoneNumber,
          role: input.role,
          address: {
            create: {
              address: input.address,
              city: input.city,
              postCode: input.postCode,
              state: input.state,
              country: input.country,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      await ctx.prisma.user.update({
        where: { email: input.email },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          dateOfBirth: new Date(input.dateOfBirth),
          phoneNumber: input.phoneNumber,
          role: input.role,
          address: {
            upsert: {
              update: {
                address: input.address,
                city: input.city,
                postCode: input.postCode,
                state: input.state,
                country: input.country,
              },
              create: {
                address: input.address,
                city: input.city,
                postCode: input.postCode,
                state: input.state,
                country: input.country,
              },
            },
          },
        },
      });
    }),
});
