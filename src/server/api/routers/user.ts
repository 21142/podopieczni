import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import { userAccountDetailsSchema } from '~/lib/validators/userValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import adminProcedure from '../procedures/adminProcedure';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

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
  getAllPeopleAssociatedWithShelter: publicProcedure.query(async ({ ctx }) => {
    const associatedShelter = await ctx.prisma.shelter.findFirst({
      where: {
        members: {
          some: {
            id: ctx.session?.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!associatedShelter) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No users associated with any shelter.`,
      });
    }

    const allUsers = await ctx.prisma.user.findMany({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return allUsers;
  }),
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      return user;
    }),
  deletePersonById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });
      await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),
  getUsersCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.user.count();
    return count;
  }),
  getUsersCountChangeFromLastMonth: publicProcedure.query(async ({ ctx }) => {
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
  }),
  add: adminProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });

      const associatedShelter = await ctx.prisma.shelter.findFirst({
        where: {
          members: {
            some: {
              id: ctx.session?.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!associatedShelter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with id: ${ctx.session?.user.id} is not associated with any shelter.`,
        });
      }

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
            image: input.image,
            address: {
              create: {
                address: input.address,
                city: input.city,
                postCode: input.postCode,
                state: input.state,
                country: input.country,
              },
            },
            worksAt: {
              connect: {
                id: associatedShelter.id,
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
            image: input.image,
            worksAt: {
              connect: {
                id: associatedShelter.id,
              },
            },
          },
        });
      }
    }),
  update: protectedProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });
      if (input.address) {
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
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
      } else {
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
          },
        });
      }
    }),
});
