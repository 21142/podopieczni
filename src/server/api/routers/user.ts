import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import WelcomeToOrganizationEmail from '~/components/emails/WelcomeToOrganizationEmail';
import { checkIfRateLimitHasExceeded } from '~/lib/checkRateLimit';
import { calculatePetAgeGroup } from '~/lib/utils';
import { userAccountDetailsSchema } from '~/lib/validators/userValidation';
import { createTRPCRouter } from '~/server/api/trpc';
import { getShelterAssociatedWithUser } from '~/server/helpers/getShelterAssociatedWithUser';
import adminProcedure from '../procedures/adminProcedure';
import protectedProcedure from '../procedures/protectedProcedure';
import publicProcedure from '../procedures/publicProcedure';

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        address: true,
      },
    });
    return user;
  }),
  getAllPeopleAssociatedWithShelter: publicProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const allUsers = await ctx.prisma.user.findMany({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return allUsers;
  }),
  getFavoritePets: protectedProcedure.query(async ({ ctx }) => {
    let pets = await ctx.prisma.pet.findMany({
      where: {
        likedBy: {
          some: {
            userId: ctx.session?.user.id,
          },
        },
      },
    });

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
  }),
  markPetAsFavorite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.favoritePet.create({
        data: {
          user: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
          pet: {
            connect: {
              id: input,
            },
          },
        },
      });
    }),
  removePetFromFavorites: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.favoritePet.deleteMany({
        where: {
          petId: input,
          userId: ctx.session?.user.id,
        },
      });
    }),
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          address: true,
        },
      });
      return user;
    }),
  deletePersonById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });

      const associatedWithUserJoinRequests =
        await ctx.prisma.joinRequest.findMany({
          where: {
            userId: input,
          },
        });

      if (associatedWithUserJoinRequests.length > 0) {
        await ctx.prisma.joinRequest.deleteMany({
          where: {
            userId: input,
          },
        });
      }

      await ctx.prisma.user.update({
        where: { id: input },
        data: {
          worksAt: {
            disconnect: true,
          },
        },
      });
    }),
  getUsersCount: publicProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return await ctx.prisma.user.count({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
      },
    });
  }),
  getUsersCountChangeFromLastMonth: publicProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    const thisMonthsCount = await ctx.prisma.user.count({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    const lastMonthsCount = await ctx.prisma.user.count({
      where: {
        worksAt: {
          is: {
            id: associatedShelter.id,
          },
        },
        createdAt: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    return thisMonthsCount - lastMonthsCount;
  }),
  add: adminProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });

      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      if (input.address) {
        await ctx.prisma.user.create({
          data: {
            title: input.title ?? undefined,
            name: `${input.firstName} ${input.lastName}`,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
            address: {
              create: {
                address: input.address.address,
                city: input.address.city,
                postCode: input.address.postCode,
                state: input.address.state,
                country: input.address.country,
              },
            },
            worksAt: {
              connect: {
                id: associatedShelter.id,
              },
            },
          },
        });
      } else {
        await ctx.prisma.user.create({
          data: {
            title: input.title ?? undefined,
            name: `${input.firstName} ${input.lastName}`,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
            worksAt: {
              connect: {
                id: associatedShelter.id,
              },
            },
          },
        });
      }
    }),
  update: protectedProcedure
    .input(userAccountDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      await checkIfRateLimitHasExceeded({
        rateLimiterName: 'main',
        identifier: ctx.session?.user.id ?? '',
      });
      if (input.address) {
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            title: input.title ?? undefined,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
            address: {
              upsert: {
                update: {
                  address: input.address.address,
                  city: input.address.city,
                  postCode: input.address.postCode,
                  state: input.address.state,
                  country: input.address.country,
                },
                create: {
                  address: input.address.address,
                  city: input.address.city,
                  postCode: input.address.postCode,
                  state: input.address.state,
                  country: input.address.country,
                },
              },
            },
          },
        });
      } else {
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            title: input.title ?? undefined,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            dateOfBirth: new Date(input.dateOfBirth),
            phoneNumber: input.phoneNumber,
            role: input.role,
            image: input.image,
          },
        });
      }
    }),
  isUserAssociatedWithShelter: protectedProcedure.query(async ({ ctx }) => {
    const associatedShelter = await getShelterAssociatedWithUser(
      ctx,
      ctx.session?.user.id
    );

    return !!associatedShelter;
  }),
  associateUserWithShelter: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const associatedShelter = await getShelterAssociatedWithUser(
        ctx,
        ctx.session?.user.id
      );

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await ctx.prisma.user.update({
        where: {
          email: input,
        },
        data: {
          worksAt: {
            connect: {
              id: associatedShelter.id,
            },
          },
        },
      });

      const joinRequest = await ctx.prisma.joinRequest.create({
        data: {
          status: 'invited',
          user: {
            connect: {
              id: user.id,
            },
          },
          shelter: {
            connect: {
              id: associatedShelter.id,
            },
          },
        },
        include: {
          shelter: true,
          user: true,
        },
      });

      const emailHtml = render(
        WelcomeToOrganizationEmail({
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
            'An error occurred while sending an email to the invited user. Not all emails are provided.',
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
    }),
});
