import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import { petDetailsSchema } from '~/lib/validators/petValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const petRouter = createTRPCRouter({
  getAllPets: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany();
    return pets;
  }),
  getAllPetsDataForTable: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        status: true,
        image: true,
      },
    });
    return pets;
  }),
  getPetById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
      });
      return pet;
    }),
  getPetsCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.pet.count();
    return count;
  }),
  getPetsCountChangeFromLastMonth: publicProcedure.query(async ({ ctx }) => {
    const thisMonthsCount = await ctx.prisma.pet.count({
      where: {
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    const lastMonthsCount = await ctx.prisma.pet.count({
      where: {
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    return thisMonthsCount - lastMonthsCount;
  }),
  getPetsAddedInTheLastMonth: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      where: {
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return pets;
  }),
  getMostRecentlyAddedPets: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return pets;
  }),
  getPetsAddedInTheLastMonthCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.pet.count({
      where: {
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    return count;
  }),
  add: protectedProcedure
    .input(petDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });
      const pet = await ctx.prisma.pet.create({
        data: {
          internalId: input.internalId,
          name: input.name,
          species: input.species,
          breed: input.breed,
          gender: input.gender,
          color: input.color,
          coat: input.coat,
          weight: parseFloat(input.weight ?? '0.0'),
          image: input.image,
          // adoptionFee: input.adoptionFee,
          dateOfBirth: new Date(input.dateOfBirth as string).toISOString(),
          status: input.status,
          // description: input.description,
          // houseTrained: input.houseTrained,
          // specialNeeds: input.specialNeeds,
          // neutered: input.neutered,
          // declawed: input.declawed,
          // aggressive: input.aggressive,
          // friendlyWithDogs: input.friendlyWithDogs,
          // friendlyWithCats: input.friendlyWithCats,
          // friendlyWithChildren: input.friendlyWithChildren,
          microchipBrand: input.microchipBrand,
          microchipNumber: input.microchipNumber,
          healthStatus: input.healthStatus,
          shelter: {
            connect: {
              id: 'clkg0af0j0000tw7lqiwgvsl9',
            },
          },
          // medicalEvents: {
          //   create: { ...input.medicalEvents },
          // },
          // intakeEvent: {
          //   create: { ...input.intakeEvent },
          // },
          // outcomeEvents: {
          //   create: input.outcomeEvents,
          // },
          // photos: {
          //   create: input.photos,
          // },
          // documents: {
          //   create: input.documents,
          // },
        },
      });
      return pet;
    }),
  deletePetById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.delete({
        where: {
          id: input,
        },
      });
    }),
});
