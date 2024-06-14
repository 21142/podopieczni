import { createTRPCRouter } from '~/server/api/trpc';
import { adoptionApplicationRouter } from './routers/adoptionApplication';
import { authRouter } from './routers/auth';
import { exampleRouter } from './routers/example';
import { petRouter } from './routers/pet';
import { shelterRouter } from './routers/shelter';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  pet: petRouter,
  shelter: shelterRouter,
  adoptionApplication: adoptionApplicationRouter,
  test: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
