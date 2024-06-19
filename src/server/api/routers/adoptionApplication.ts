import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { adoptionSurveySchema } from '~/lib/validators/adoptionSurveyValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import { getShelterAssociatedWithUser } from '~/server/helpers/getShelterAssociatedWithUser';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const adoptionApplicationRouter = createTRPCRouter({
  getAllForShelter: protectedProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );
    const adoptionApplications = await ctx.prisma.adoptionApplication.findMany({
      where: {
        shelterId: associatedShelter.id,
      },
      include: {
        pet: {
          select: {
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        address: true,
      },
    });
    return adoptionApplications;
  }),
  getApplicationById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );
      const adoptionApplication =
        await ctx.prisma.adoptionApplication.findFirst({
          where: {
            id: input,
            shelterId: associatedShelter.id,
          },
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            user: {
              select: {
                image: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
            address: true,
          },
        });

      if (!adoptionApplication) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Adoption application not found for id: ${input}`,
        });
      }

      return adoptionApplication;
    }),
  getPetIdByApplicationId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const adoptionApplication =
        await ctx.prisma.adoptionApplication.findFirst({
          where: {
            id: input,
          },
          select: {
            petId: true,
          },
        });

      if (!adoptionApplication) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Adoption application not found for id: ${input}`,
        });
      }

      return adoptionApplication.petId;
    }),
  markAsContacted: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const adoptionApplication = await ctx.prisma.adoptionApplication.update({
        where: {
          id: input,
          shelterId: associatedShelter.id,
        },
        data: {
          status: 'CONTACTED',
        },
      });

      return adoptionApplication;
    }),
  acceptApplication: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const adoptionApplication = await ctx.prisma.adoptionApplication.update({
        where: {
          id: input,
          shelterId: associatedShelter.id,
        },
        data: {
          status: 'APPROVED',
        },
        include: {
          pet: true,
        },
      });

      if (!adoptionApplication) {
        throw new Error('Adoption application not found in your shelter');
      }

      await ctx.prisma.outcomeEvent.create({
        data: {
          petId: adoptionApplication.petId,
          eventType: 'ADOPTION',
          eventDate: new Date(),
        },
      });

      await ctx.prisma.pet.update({
        where: {
          id: adoptionApplication.petId,
        },
        data: {
          availableForAdoption: false,
          status: 'adopted',
        },
      });

      return adoptionApplication;
    }),
  rejectApplication: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const adoptionApplication = await ctx.prisma.adoptionApplication.update({
        where: {
          id: input,
          shelterId: associatedShelter.id,
        },
        data: {
          status: 'REJECTED',
        },
      });

      return adoptionApplication;
    }),
  create: publicProcedure
    .input(
      z.object({
        petId: z.string(),
        data: adoptionSurveySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const shelterWherePetIsLocated = await ctx.prisma.shelter.findFirst({
        where: {
          pets: {
            some: {
              id: input.petId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!shelterWherePetIsLocated) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while creating an adoption application. No shelter found for the pet: ${input.petId}`,
        });
      }

      const userId = ctx.session?.user.id || null;

      const adoptionApplication = await ctx.prisma.adoptionApplication.create({
        data: {
          ...input.data,
          userId: userId,
          shelterId: shelterWherePetIsLocated.id,
          petId: input.petId,
          address: input.data.address
            ? {
                create: input.data.address,
              }
            : undefined,
        },
      });

      return adoptionApplication;
    }),
});
