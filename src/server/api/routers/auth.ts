import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { prisma } from '~/server/db';
import { Roles } from '~/utils/constants';
import { signUpSchema } from '~/utils/validation/auth';

export const authRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return 'You are logged in and can see this secret message!';
  }),
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),
  setShelterWorkerRole: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'you can set your role only once per account',
      });
    }
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { role: Roles.Shelter },
    });
    return 'Updated role - shelter';
  }),
  setAdoptingRole: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'you can set your role only once per account',
      });
    }
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { role: Roles.Adopter },
    });
    return 'Updated role - adopting';
  }),
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with provided details already exists.',
        });
      }

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: 'User created successfully',
        result: result.email,
      };
    }),
  // verifyPassword: protectedProcedure
  //   .input(
  //     z.object({
  //       passwordInput: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const user = await prisma.user.findUnique({
  //       where: {
  //         id: ctx.user.id,
  //       },
  //     });

  //     if (!user?.password) {
  //       throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
  //     }

  //     const passwordsMatch = await verifyPassword(
  //       input.passwordInput,
  //       user.password
  //     );

  //     if (!passwordsMatch) {
  //       throw new TRPCError({ code: 'UNAUTHORIZED' });
  //     }

  //     return;
  //   }),
});
