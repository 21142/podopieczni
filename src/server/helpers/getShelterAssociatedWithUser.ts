import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { type Session } from 'next-auth';

type Context = {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};

export const getShelterAssociatedWithUser = async (
  ctx: Context,
  userId: string | null | undefined
) => {
  if (!userId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User id is required to fetch associated shelter.',
    });
  }

  const associatedShelter = await ctx.prisma.shelter.findFirst({
    where: {
      members: {
        some: {
          id: userId,
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
      message: `User with id: ${userId} is not associated with any shelter.`,
    });
  }

  return associatedShelter;
};
