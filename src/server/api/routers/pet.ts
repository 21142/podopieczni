import { z } from 'zod';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import {
  document,
  fullPetDetailsSchema,
  medicalEvent,
  note,
  outcomeEvent,
  petDetailsSchema,
  photo,
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
  getPetMedicalEvents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
        include: {
          medicalEvents: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      return pet?.medicalEvents;
    }),
  getPetOutcomeEvents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
        include: {
          outcomeEvents: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      return pet?.outcomeEvents;
    }),
  getPetDocuments: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
        include: {
          documents: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      return pet?.documents;
    }),
  getPetPhotos: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
        include: {
          photos: true,
        },
      });
      return pet?.photos;
    }),
  getPetNotes: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input.id },
        include: {
          notes: true,
        },
      });
      return pet?.notes;
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
          microchipBrand: input.microchipBrand,
          microchipNumber: input.microchipNumber,
          healthStatus: input.healthStatus,
          shelter: {
            connect: {
              id: 'clkg0af0j0000tw7lqiwgvsl9',
            },
          },
          intakeEventDate: input.intakeEventDate,
          intakeEventType: input.intakeEventType,
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
          houseTrained: input.pet.houseTrained,
          specialNeeds: input.pet.specialNeeds,
          neutered: input.pet.neutered,
          declawed: input.pet.declawed,
          aggressive: input.pet.aggressive,
          friendlyWithDogs: input.pet.friendlyWithDogs,
          friendlyWithCats: input.pet.friendlyWithCats,
          friendlyWithChildren: input.pet.friendlyWithChildren,
          microchipBrand: input.pet.microchipBrand,
          microchipNumber: input.pet.microchipNumber,
          healthStatus: input.pet.healthStatus,
          shelter: {
            connect: {
              id: 'clkg0af0j0000tw7lqiwgvsl9',
            },
          },
          intakeEventDate: input.pet.intakeEventDate,
          intakeEventType: input.pet.intakeEventType,
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
  updatePetMedicalEventMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        event: medicalEvent,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          medicalEvents: {
            create: {
              ...input.event,
              cost: parseFloat(input.event.cost ?? ''),
            },
          },
        },
      });
    }),
  updatePetOutcomeEventMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        event: outcomeEvent,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          outcomeEvents: {
            create: input.event,
          },
        },
      });
    }),
  updatePetDocumentEventMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        document: document,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          documents: {
            create: input.document,
          },
        },
      });
    }),
  addPetPhotoMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        photo: photo,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          photos: {
            create: input.photo,
          },
        },
      });
    }),
  addPetNoteMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        note: note,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          notes: {
            create: input.note,
          },
        },
      });
    }),
  deletePetDocumentMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        documentId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          documents: {
            delete: {
              id: input.documentId,
            },
          },
        },
      });
    }),
  deletePetPhotoMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          photos: {
            delete: {
              id: input.photoId,
            },
          },
        },
      });
    }),
  deletePetNoteMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        noteId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          notes: {
            delete: {
              id: input.noteId,
            },
          },
        },
      });
    }),
  deletePetMedicalEventMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          medicalEvents: {
            delete: {
              id: input.eventId,
            },
          },
        },
      });
    }),
  deletePetOutcomeEventMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          outcomeEvents: {
            delete: {
              id: input.eventId,
            },
          },
        },
      });
    }),
});
