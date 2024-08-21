import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import InviteToOrganizationEmail from '~/components/emails/InviteToOrganizationEmail';
import JoinRequestRejected from '~/components/emails/JoinRequestRejectedEmail';
import { Roles } from '~/lib/constants';
import { getSheltersSortOrderBy } from '~/lib/utils';
import { shelterSettingsSchema } from '~/lib/validators/shelterValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import { sheltersSearchWhereConditions } from '~/server/helpers/searchConditions';
import adminProcedure from '../procedures/adminProcedure';
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
  queryAvailableShelters: publicProcedure
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
        const orderBy = getSheltersSortOrderBy(sortBy);

        const where = searchQuery
          ? sheltersSearchWhereConditions(searchQuery)
          : undefined;

        const shelters = await ctx.prisma.shelter.findMany({
          where,
          include: {
            address: true,
          },
          orderBy,
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (shelters.length > limit) {
          const nextItem = shelters.pop();
          nextCursor = nextItem?.id;
        }

        return {
          shelters,
          nextCursor,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching shelters',
        });
      }
    }),
  requestToJoinShelter: protectedProcedure
    .input(
      z.object({
        shelterName: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      if (!input.shelterName) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Shelter name is required.',
        });
      }

      const shelter = await ctx.prisma.shelter.findFirst({
        where: {
          name: input.shelterName,
        },
      });

      if (!shelter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Shelter not found.',
        });
      }

      const existingRequest = await ctx.prisma.joinRequest.findUnique({
        where: {
          userId_shelterId: {
            userId,
            shelterId: shelter.id,
          },
        },
      });

      if (existingRequest) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while requesting to join the shelter.',
        });
      }

      const joinRequest = await ctx.prisma.joinRequest.create({
        data: {
          userId,
          shelterId: shelter.id,
          status: 'pending',
        },
      });

      return joinRequest;
    }),
  getJoinRequests: protectedProcedure.query(async ({ ctx }) => {
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
      throw new TRPCError({
        code: 'NOT_FOUND',
        message:
          'Error while looking for a shelter associated with your account.',
      });
    }

    const joinRequests = await ctx.prisma.joinRequest.findMany({
      where: {
        shelterId: shelter.id,
      },
      include: {
        user: true,
      },
    });

    return joinRequests;
  }),
  rejectJoinRequest: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const joinRequest = await ctx.prisma.joinRequest.findUnique({
        where: {
          id: input.id,
        },
        include: {
          shelter: true,
          user: true,
        },
      });

      if (!joinRequest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Join request not found.',
        });
      }

      if (joinRequest.status === 'rejected') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Join request already rejected.',
        });
      }

      await ctx.prisma.joinRequest.update({
        where: {
          id: input.id,
        },
        data: {
          status: 'rejected',
        },
      });

      await ctx.prisma.shelter.update({
        where: {
          id: joinRequest.shelterId,
        },
        data: {
          members: {
            disconnect: {
              id: joinRequest.userId,
            },
          },
        },
      });

      const emailHtml = render(
        JoinRequestRejected({
          username: joinRequest.user.name ?? undefined,
          teamName: joinRequest.shelter.name,
        })
      );

      const emailServer = {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      };

      if (
        joinRequest.user.email === undefined ||
        joinRequest.user.email === null ||
        joinRequest.shelter.email === undefined ||
        joinRequest.shelter.email === null
      ) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occurred while sending an email to the user. Not all emails are provided.',
        });
      }

      nodemailer.createTransport(emailServer).sendMail(
        {
          to: joinRequest.user.email,
          from: `${joinRequest.shelter.name}.podopieczni@trial-neqvygme57d40p7w.mlsender.net`,
          subject: `Witamy w ${joinRequest.shelter.name}`,
          text: `Witamy w \n${joinRequest.shelter.name}`,
          html: emailHtml,
        },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );

      return joinRequest;
    }),
  acceptJoinRequest: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const joinRequest = await ctx.prisma.joinRequest.findUnique({
        where: {
          id: input.id,
        },
        include: {
          shelter: true,
          user: true,
        },
      });

      if (!joinRequest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Join request not found.',
        });
      }

      if (joinRequest.status === 'accepted') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Join request already accepted.',
        });
      }

      await ctx.prisma.joinRequest.update({
        where: {
          id: input.id,
        },
        data: {
          status: 'accepted',
        },
      });

      await ctx.prisma.shelter.update({
        where: {
          id: joinRequest.shelterId,
        },
        data: {
          members: {
            connect: {
              id: joinRequest.userId,
            },
          },
        },
      });

      const emailHtml = render(
        InviteToOrganizationEmail({
          username: joinRequest.user.name ?? undefined,
          userImage: joinRequest.user.image ?? undefined,
          teamName: joinRequest.shelter.name,
          teamImage: joinRequest.shelter.logo ?? undefined,
        })
      );

      const emailServer = {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      };

      if (
        joinRequest.user.email === undefined ||
        joinRequest.user.email === null ||
        joinRequest.shelter.email === undefined ||
        joinRequest.shelter.email === null
      ) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occurred while sending an email to the user. Not all emails are provided.',
        });
      }

      nodemailer.createTransport(emailServer).sendMail(
        {
          to: joinRequest.user.email,
          from: `${joinRequest.shelter.name}.podopieczni@trial-neqvygme57d40p7w.mlsender.net`,
          subject: `Witamy w ${joinRequest.shelter.name}`,
          text: `Witamy w \n${joinRequest.shelter.name}`,
          html: emailHtml,
        },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );

      return joinRequest;
    }),
  deleteJoinRequest: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const joinRequest = await ctx.prisma.joinRequest.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!joinRequest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Join request not found.',
        });
      }

      await ctx.prisma.joinRequest.delete({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.shelter.update({
        where: {
          id: joinRequest.shelterId,
        },
        data: {
          members: {
            disconnect: {
              id: joinRequest.userId,
            },
          },
        },
      });

      return joinRequest;
    }),
});
