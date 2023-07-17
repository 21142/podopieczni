import { z } from 'zod';
import { petDetailsSchema } from '~/lib/validators/petValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const petRouter = createTRPCRouter({
  getAllPets: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany();
    return pets;
  }),
  getPetById: protectedProcedure
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
  add: protectedProcedure
    .input(petDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.create({
        data: {
          name: input.name,
          species: input.spieces,
          breed: input.breed,
          gender: input.gender,
          age: input.age,
          color: input.color,
          coat: input.coat,
          weight: input.weight,
          adoptionFee: input.adoptionFee,
          dateOfBirth: new Date(input.dateOfBirth as string),
          status: input.status,
          description: input.description,
          houseTrained: input.houseTrained,
          specialNeeds: input.specialNeeds,
          neutered: input.neutered,
          declawed: input.declawed,
          aggressive: input.aggressive,
          friendlyWithDogs: input.friendlyWithDogs,
          friendlyWithCats: input.friendlyWithCats,
          friendlyWithChildren: input.friendlyWithChildren,
          microchipBrand: input.microchipBrand,
          microchipNumber: input.microchipNumber,
          shelter: {
            connect: {
              id: input.shelterId,
            },
          },
          healthStatus: input.healthStatus,
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
    }),
});
