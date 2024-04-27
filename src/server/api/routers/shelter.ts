import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter } from '~/server/api/trpc';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const shelterRouter = createTRPCRouter({
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
