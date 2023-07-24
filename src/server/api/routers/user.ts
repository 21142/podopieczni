import { userAccountDetailsSchema } from '~/lib/validators/userValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import adminProcedure from '../procedures/adminProcedure';
import protectedProcedure from '../procedures/protectedProcedure';

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
  getUsersCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.user.count();
    return count;
  }),
  getUsersCountChangeFromLastMonth: protectedProcedure.query(
    async ({ ctx }) => {
      const thisMonthsCount = await ctx.prisma.user.count({
        where: {
          createdAt: {
            gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });
      const lastMonthsCount = await ctx.prisma.user.count({
        where: {
          createdAt: {
            gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
            lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });
      return thisMonthsCount - lastMonthsCount;
    }
  ),
  add: adminProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.address) {
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
      } else {
        await ctx.prisma.user.create({
          data: {
            name: `${input.firstName} ${input.lastName}`,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
          },
        });
      }
    }),
  update: protectedProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
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
