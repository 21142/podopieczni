import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Roles } from '~/lib/constants';
import { shelterSettingsSchema } from '~/lib/validators/shelterValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const shelterRouter = createTRPCRouter({
  getSheltersCount: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shelter.count();
  }),
  getSheltersNames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shelter.findMany({
      select: {
        name: true,
      },
    });
  }),
  getShelterDetails: protectedProcedure.query(async ({ ctx }) => {
    const shelter = await ctx.prisma.shelter.findFirst({
      where: {
        members: {
          some: {
            id: ctx.session?.user.id,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return shelter;
  }),
  upsertShelterDetails: protectedProcedure
    .input(shelterSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const shelter = await ctx.prisma.shelter.findFirst({
        where: {
          members: {
            some: {
              id: userId,
            },
          },
        },
      });

      if (!shelter) {
        await ctx.prisma.shelter.create({
          data: {
            ...input,
            members: {
              connect: { id: userId },
            },
            address: {
              create: {
                address: input.address?.address,
                city: input.address?.city,
                state: input.address?.state,
                postCode: input.address?.postCode,
                country: input.address?.country,
              },
            },
          },
        });

        await ctx.prisma.user.update({
          where: { id: userId },
          data: { role: Roles.Admin },
        });
      } else {
        return await ctx.prisma.shelter.update({
          where: {
            id: shelter.id,
          },
          data: {
            ...input,
            address: {
              upsert: {
                create: {
                  address: input.address?.address,
                  city: input.address?.city,
                  state: input.address?.state,
                  postCode: input.address?.postCode,
                  country: input.address?.country,
                },
                update: {
                  address: input.address?.address,
                  city: input.address?.city,
                  state: input.address?.state,
                  postCode: input.address?.postCode,
                  country: input.address?.country,
                },
              },
            },
          },
        });
      }
    }),
  getShelterById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const shelter = await ctx.prisma.shelter.findFirst({
        where: {
          id: input.id,
        },
        include: {
          address: true,
        },
      });

      return shelter;
    }),
  querySheltersFulltextSearch: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (!input.searchQuery) {
          const shelters = await ctx.prisma.shelter.findMany({
            include: {
              address: true,
            },
          });

          return shelters;
        }
        const shelters = await ctx.prisma.shelter.findMany({
          where: {
            OR: [
              {
                name: { search: input.searchQuery },
              },
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
          include: {
            address: true,
          },
        });

        return shelters;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching shelters',
        });
      }
    }),
});
