import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import {
  fullPetDetailsSchema,
  petDetailsSchema,
} from '~/lib/validators/petValidation';
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
          //TODO: remove this parsing
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
          intakeEventDate: input.intakeEventDate,
          intakeEventType: input.intakeEventType,
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
  updatePetById: protectedProcedure
    .input(z.object({ id: z.string(), pet: fullPetDetailsSchema }))
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });
      await ctx.prisma.pet.update({
        where: { id: input.id },
        data: {
          internalId: input.pet.internalId,
          name: input.pet.name,
          species: input.pet.species,
          breed: input.pet.breed,
          gender: input.pet.gender,
          color: input.pet.color,
          coat: input.pet.coat,
          //TODO: remove this parsing
          weight: parseFloat(input.pet.weight ?? '0.0'),
          image: input.pet.image,
          // adoptionFee: input.pet.adoptionFee,
          dateOfBirth: new Date(input.pet.dateOfBirth as string).toISOString(),
          status: input.pet.status,
          // description: input.pet.description,
          // houseTrained: input.pet.houseTrained,
          // specialNeeds: input.pet.specialNeeds,
          // neutered: input.pet.neutered,
          // declawed: input.pet.declawed,
          // aggressive: input.pet.aggressive,
          // friendlyWithDogs: input.pet.friendlyWithDogs,
          // friendlyWithCats: input.pet.friendlyWithCats,
          // friendlyWithChildren: input.pet.friendlyWithChildren,
          microchipBrand: input.pet.microchipBrand,
          microchipNumber: input.pet.microchipNumber,
          healthStatus: input.pet.healthStatus,
          shelter: {
            connect: {
              id: 'clkg0af0j0000tw7lqiwgvsl9',
            },
          },
          // medicalEvents: {
          //   create: { ...input.pet.medicalEvents },
          // },
          intakeEventDate: input.pet.intakeEventDate,
          intakeEventType: input.pet.intakeEventType,
          // outcomeEvents: {
          //   create: input.pet.outcomeEvents,
          // },
          // photos: {
          //   create: input.pet.photos,
          // },
          // documents: {
          //   create: input.pet.documents,
          // },
        },
      });
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
