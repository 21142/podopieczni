import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env.mjs';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import { calculatePetAgeGroup, calculatePetSizeGroup } from '~/lib/utils';
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
import adminProcedure from '../procedures/adminProcedure';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const petRouter = createTRPCRouter({
  getAllPets: adminProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany();
    return pets;
  }),
  getFeaturedAnimals: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pet
      .findMany({
        where: {
          availableForAdoption: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
      })
      .then((pets) => {
        return pets.map((pet) => ({
          ...pet,
          age: calculatePetAgeGroup(pet.dateOfBirth),
        }));
      });
  }),
  queryPetsAvailableForAdoptionFulltextSearch: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        let pets;
        if (input.searchQuery) {
          pets = await ctx.prisma.pet.findMany({
            where: {
              availableForAdoption: true,
              OR: [
                {
                  shelter: {
                    OR: [
                      { name: { search: input.searchQuery } },
                      {
                        address: {
                          OR: [
                            { address: { search: input.searchQuery } },
                            { city: { search: input.searchQuery } },
                            { state: { search: input.searchQuery } },
                            { country: { search: input.searchQuery } },
                            { postCode: { search: input.searchQuery } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { species: { search: input.searchQuery } },
                { breed: { search: input.searchQuery } },
                { color: { search: input.searchQuery } },
                { coat: { search: input.searchQuery } },
                { gender: { search: input.searchQuery } },
              ],
            },
            include: {
              shelter: {
                include: {
                  address: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          pets = await ctx.prisma.pet.findMany({
            where: {
              availableForAdoption: true,
            },
            include: {
              shelter: {
                include: {
                  address: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        pets = pets.map((pet) => ({
          ...pet,
          age: pet.age || calculatePetAgeGroup(pet.dateOfBirth),
        }));

        return pets;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching pets',
        });
      }
    }),
  getAllPetsDataForTable: publicProcedure.query(async ({ ctx }) => {
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

    const pets = await ctx.prisma.pet.findMany({
      where: {
        shelterId: associatedShelter?.id,
      },
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        status: true,
        image: true,
        shelter: {
          select: {
            address: {
              select: {
                lat: true,
                lng: true,
              },
            },
          },
        },
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
        include: {
          photos: true,
          shelter: {
            include: {
              address: true,
            },
          },
        },
      });

      if (!pet) return;

      const profilePhoto = pet.image ? [{ url: pet.image }] : [];

      return {
        ...pet,
        photos: [...profilePhoto, ...pet.photos],
        age: calculatePetAgeGroup(pet.dateOfBirth),
        size: calculatePetSizeGroup(pet.weight ?? 0),
        url: `${env.NEXT_PUBLIC_BASE_URL}/pet/${pet.id}`,
      };
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

      const pet = await ctx.prisma.pet.create({
        data: {
          internalId: input.internalId,
          name: input.name,
          species: input.species,
          breed: input.breed,
          gender: input.gender,
          color: input.color,
          coat: input.coat,
          image: input.image,
          dateOfBirth: new Date(input.dateOfBirth as string).toISOString(),
          age: input.dateOfBirth
            ? calculatePetAgeGroup(new Date(input.dateOfBirth))
            : undefined,
          status: input.status,
          microchipBrand: input.microchipBrand,
          microchipNumber: input.microchipNumber,
          healthStatus: input.healthStatus,
          //TODO: remove this parsing
          weight: parseFloat(input.weight ?? '0.0'),
          shelter: {
            connect: {
              id: associatedShelter.id,
            },
          },
          intakeEventDate: input.intakeEventDate,
          intakeEventType: input.intakeEventType,
          availableForAdoption: false,
          adoptionFeeKnown: false,
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
          adoptionFee: input.pet.adoptionFee,
          dateOfBirth: input.pet.dateOfBirth
            ? new Date(input.pet.dateOfBirth).toISOString()
            : undefined,
          age: input.pet.dateOfBirth
            ? calculatePetAgeGroup(new Date(input.pet.dateOfBirth))
            : undefined,
          status: input.pet.status,
          description: input.pet.description,
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
              id: associatedShelter.id,
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
  markAvailableForAdoption: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const pet = await ctx.prisma.pet.findUnique({
        where: { id: input },
      });

      if (!pet) {
        return {
          success: false,
          message: 'Pet not found',
        };
      }

      if (pet.availableForAdoption) {
        return {
          success: false,
          message: 'Pet is already listed for adoption',
        };
      }

      await ctx.prisma.pet.update({
        where: { id: input },
        data: {
          availableForAdoption: true,
        },
      });

      return { success: true };
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
  savePetAdoptionDetailsMutation: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        values: z.object({
          availableForAdoption: z.boolean().optional(),
          description: z.string().optional(),
          adoptionFee: z.string().optional(),
          adoptionFeeKnown: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pet.update({
        where: { id: input.petId },
        data: {
          availableForAdoption: input.values.availableForAdoption,
          description: input.values.description,
          adoptionFee: input.values.adoptionFee,
          adoptionFeeKnown: input.values.adoptionFeeKnown,
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
