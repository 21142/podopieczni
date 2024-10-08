import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { links } from '~/config/siteConfig';
import { env } from '~/env.mjs';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import {
  calculatePetAgeGroup,
  calculatePetSizeGroup,
  getPetsSortOrderBy,
} from '~/lib/utils';
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
import { getShelterAssociatedWithUser } from '~/server/helpers/getShelterAssociatedWithUser';
import { petsSearchWhereConditions } from '~/server/helpers/searchConditions';
import adminProcedure from '../procedures/adminProcedure';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const petRouter = createTRPCRouter({
  getAllPets: adminProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany();
    return pets;
  }),
  getPetsAvailableForAdoptionCount: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pet.count({
      where: {
        availableForAdoption: true,
      },
    });
  }),
  getAdoptedPetsCountGlobally: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pet.count({
      where: {
        outcomeEvents: {
          some: {
            eventType: 'ADOPTION',
          },
        },
      },
    });
  }),
  getAdoptedPetsCount: protectedProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser?.id,
        outcomeEvents: {
          some: {
            eventType: 'ADOPTION',
          },
        },
      },
    });
  }),
  getAdoptedPetsCountChangeFromLastMonth: protectedProcedure.query(
    async ({ ctx }) => {
      const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const thisMonthsCount = await ctx.prisma.pet.count({
        where: {
          shelterId: shelterAssociatedWithUser?.id,
          outcomeEvents: {
            some: {
              eventType: 'ADOPTION',
              createdAt: {
                gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              },
            },
          },
        },
      });
      const lastMonthsCount = await ctx.prisma.pet.count({
        where: {
          shelterId: shelterAssociatedWithUser?.id,
          outcomeEvents: {
            some: {
              eventType: 'ADOPTION',
              createdAt: {
                gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              },
            },
          },
        },
      });
      return thisMonthsCount - lastMonthsCount;
    }
  ),
  getFeaturedAnimals: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pet
      .findMany({
        where: {
          availableForAdoption: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: 6,
      })
      .then(async (pets) => {
        if (ctx.session?.user.id) {
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
        } else {
          pets = pets.map((pet) => ({
            ...pet,
            age: pet.age || calculatePetAgeGroup(pet.dateOfBirth),
          }));
          return pets;
        }
      });
  }),
  queryPetsAvailableForAdoption: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        filter: z
          .object({
            sortBy: z.string().optional(),
          })
          .optional(),
        cursor: z.string().optional(),
        limit: z.number().default(12),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { searchQuery, filter, cursor } = input;
        const limit = input.limit ?? 12;

        const sortBy = filter?.sortBy;
        const orderBy = getPetsSortOrderBy(sortBy);

        const pets = await ctx.prisma.pet.findMany({
          where: searchQuery
            ? petsSearchWhereConditions(searchQuery)
            : { availableForAdoption: true },
          include: {
            shelter: {
              include: {
                address: true,
              },
            },
          },
          orderBy: orderBy,
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (pets.length > limit) {
          const nextItem = pets.pop();
          nextCursor = nextItem?.id;
        }

        if (ctx.session?.user.id) {
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

          return {
            pets: pets.map((pet) => ({
              ...pet,
              age: pet.age || calculatePetAgeGroup(pet.dateOfBirth),
              isLikedByUser: favoriteStatusMap[pet.id] || false,
            })),
            nextCursor,
          };
        } else {
          return {
            pets: pets.map((pet) => ({
              ...pet,
              age: pet.age || calculatePetAgeGroup(pet.dateOfBirth),
            })),
            nextCursor,
          };
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching pets',
        });
      }
    }),
  getAllPetsDataForTable: publicProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

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

      if (ctx.session?.user.id) {
        const favoritePet = await ctx.prisma.favoritePet.findFirst({
          where: {
            userId: ctx.session.user.id,
            petId: pet.id,
          },
          select: {
            petId: true,
          },
        });
        pet.isLikedByUser = !!favoritePet;
      }

      return {
        ...pet,
        photos: [...profilePhoto, ...pet.photos],
        age: calculatePetAgeGroup(pet.dateOfBirth),
        size: calculatePetSizeGroup(pet.weight ?? 0),
        url: `${env.NEXT_PUBLIC_BASE_URL}${links.pet(pet.id)}`,
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
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser?.id,
      },
    });
  }),
  getReturnedPetsCount: protectedProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        outcomeEvents: {
          some: {
            eventType: 'RETURN',
          },
        },
      },
    });
  }),
  getReturnedPetsCountChangeFromLastMonth: protectedProcedure.query(
    async ({ ctx }) => {
      const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const thisMonthsCount = await ctx.prisma.pet.count({
        where: {
          shelterId: shelterAssociatedWithUser.id,
          outcomeEvents: {
            some: {
              eventType: 'RETURN',
              createdAt: {
                gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              },
            },
          },
        },
      });
      const lastMonthsCount = await ctx.prisma.pet.count({
        where: {
          shelterId: shelterAssociatedWithUser.id,
          outcomeEvents: {
            some: {
              eventType: 'RETURN',
              createdAt: {
                gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              },
            },
          },
        },
      });
      return thisMonthsCount - lastMonthsCount;
    }
  ),
  getPetsCountChangeFromLastMonth: protectedProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthsCount = await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        createdAt: {
          gte: startOfThisMonth,
        },
      },
    });

    const lastMonthsCount = await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
    });

    return thisMonthsCount - lastMonthsCount;
  }),
  getPetsAddedInTheLastMonth: publicProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.pet.findMany({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });
  }),
  getMostRecentlyAddedPets: publicProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const pets = await ctx.prisma.pet.findMany({
      where: {
        shelterId: shelterAssociatedWithUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    return pets;
  }),
  getDataForAnimalsReturnRateChart: protectedProcedure.query(
    async ({ ctx }) => {
      const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const beginningOfThisYear = new Date(new Date().getFullYear(), 0, 1);

      const pets = await ctx.prisma.pet.findMany({
        where: {
          shelterId: shelterAssociatedWithUser.id,
          outcomeEvents: {
            some: {
              eventType: 'RETURN',
              createdAt: {
                gt: beginningOfThisYear,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          outcomeEvents: true,
        },
      });

      const months = [
        { name: 'Sty', total: 0 },
        { name: 'Lut', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Kwi', total: 0 },
        { name: 'Maj', total: 0 },
        { name: 'Cze', total: 0 },
        { name: 'Lip', total: 0 },
        { name: 'Sie', total: 0 },
        { name: 'Wrz', total: 0 },
        { name: 'Paź', total: 0 },
        { name: 'Lis', total: 0 },
        { name: 'Gru', total: 0 },
      ];

      pets.forEach((pet) => {
        pet.outcomeEvents.forEach((event) => {
          if (event.eventType === 'RETURN') {
            const outcomeDate = new Date(event.eventDate);
            const monthIndex = outcomeDate.getMonth();

            if (monthIndex !== -1) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              months[monthIndex]!.total += 1;
            }
          }
        });
      });

      return months;
    }
  ),
  getDataForEuthanizedAnimalsChart: protectedProcedure.query(
    async ({ ctx }) => {
      const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const beginningOfThisYear = new Date(new Date().getFullYear(), 0, 1);

      const pets = await ctx.prisma.pet.findMany({
        where: {
          shelterId: shelterAssociatedWithUser.id,
          outcomeEvents: {
            some: {
              eventType: 'EUTHANIZED',
              createdAt: {
                gt: beginningOfThisYear,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          outcomeEvents: true,
        },
      });

      const months = [
        { name: 'Sty', total: 0 },
        { name: 'Lut', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Kwi', total: 0 },
        { name: 'Maj', total: 0 },
        { name: 'Cze', total: 0 },
        { name: 'Lip', total: 0 },
        { name: 'Sie', total: 0 },
        { name: 'Wrz', total: 0 },
        { name: 'Paź', total: 0 },
        { name: 'Lis', total: 0 },
        { name: 'Gru', total: 0 },
      ];

      pets.forEach((pet) => {
        pet.outcomeEvents.forEach((event) => {
          if (event.eventType === 'EUTHANIZED') {
            const outcomeDate = new Date(event.eventDate);
            const monthIndex = outcomeDate.getMonth();

            if (monthIndex !== -1) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              months[monthIndex]!.total += 1;
            }
          }
        });
      });

      return months;
    }
  ),
  getDataForAdmittedAnimalsRaportChart: protectedProcedure.query(
    async ({ ctx }) => {
      const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const beginningOfThisYear = new Date(new Date().getFullYear(), 0, 1);

      const pets = await ctx.prisma.pet.findMany({
        where: {
          shelterId: shelterAssociatedWithUser.id,
          createdAt: {
            gt: beginningOfThisYear,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const months = [
        { name: 'Sty', total: 0 },
        { name: 'Lut', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Kwi', total: 0 },
        { name: 'Maj', total: 0 },
        { name: 'Cze', total: 0 },
        { name: 'Lip', total: 0 },
        { name: 'Sie', total: 0 },
        { name: 'Wrz', total: 0 },
        { name: 'Paź', total: 0 },
        { name: 'Lis', total: 0 },
        { name: 'Gru', total: 0 },
      ];

      pets.forEach((pet) => {
        const monthIndex = new Date(pet.createdAt).getMonth();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        months[monthIndex]!.total += 1;
      });

      return months;
    }
  ),
  getDataForAdoptionRaportChart: protectedProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const beginningOfThisYear = new Date(new Date().getFullYear(), 0, 1);

    const pets = await ctx.prisma.pet.findMany({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        outcomeEvents: {
          some: {
            eventType: 'ADOPTION',
            createdAt: {
              gt: beginningOfThisYear,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        outcomeEvents: true,
      },
    });

    const months = [
      { name: 'Sty', total: 0 },
      { name: 'Lut', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Kwi', total: 0 },
      { name: 'Maj', total: 0 },
      { name: 'Cze', total: 0 },
      { name: 'Lip', total: 0 },
      { name: 'Sie', total: 0 },
      { name: 'Wrz', total: 0 },
      { name: 'Paź', total: 0 },
      { name: 'Lis', total: 0 },
      { name: 'Gru', total: 0 },
    ];

    pets.forEach((pet) => {
      pet.outcomeEvents.forEach((event) => {
        if (event.eventType === 'ADOPTION') {
          const outcomeDate = new Date(event.eventDate);
          const monthIndex = outcomeDate.getMonth();

          if (monthIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            months[monthIndex]!.total += 1;
          }
        }
      });
    });

    return months;
  }),
  getPetsAddedInTheLastMonthCount: publicProcedure.query(async ({ ctx }) => {
    const shelterAssociatedWithUser = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const count = await ctx.prisma.pet.count({
      where: {
        shelterId: shelterAssociatedWithUser.id,
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    if (!count) {
      return -1;
    }
    return count;
  }),
  add: protectedProcedure
    .input(petDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });

      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

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

      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

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
          publishedAt: new Date(),
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
          publishedAt: new Date(),
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
