import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import { calculatePetAgeGroup } from '~/lib/utils';
import { userAccountDetailsSchema } from '~/lib/validators/userValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import { getShelterAssociatedWithUser } from '~/server/helpers/getShelterAssociatedWithUser';
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
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

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
  getFavoritePets: protectedProcedure.query(async ({ ctx }) => {
    let pets = await ctx.prisma.pet.findMany({
      where: {
        likedBy: {
          some: {
            userId: ctx.session?.user.id,
          },
        },
      },
    });

    const petIds = pets.map((pet) => pet.id);

    const favoritePets = await ctx.prisma.favoritePet.findMany({
      where: {
        userId: ctx.session.user.id,
        petId: {
          in: petIds,
        },
      },
      select: {
        petId: true,
      },
    });

    const favoriteStatusMap: { [key: string]: boolean } = {};
    for (const favoritePet of favoritePets) {
      favoriteStatusMap[favoritePet.petId] = true;
    }

    pets = pets.map((pet) => ({
      ...pet,
      age: pet.age || calculatePetAgeGroup(pet.dateOfBirth),
      isLikedByUser: favoriteStatusMap[pet.id] || false,
    }));

    return pets;
  }),
  markPetAsFavorite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.favoritePet.create({
        data: {
          user: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
          pet: {
            connect: {
              id: input,
            },
          },
        },
      });
    }),
  removePetFromFavorites: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.favoritePet.deleteMany({
        where: {
          petId: input,
          userId: ctx.session?.user.id,
        },
      });
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
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.user.count({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
      },
    });
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

      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      if (input.address) {
        await ctx.prisma.user.create({
          data: {
            title: input.title ?? undefined,
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
            title: input.title ?? undefined,
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
  isUserAssociatedWithShelter: protectedProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return !!associatedShelter;
  }),
});
