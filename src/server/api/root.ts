import { createTRPCRouter } from '~/server/api/trpc';
import { adoptionApplicationRouter } from './routers/adoptionApplication';
import { authRouter } from './routers/auth';
import { exampleRouter } from './routers/example';
import { petRouter } from './routers/pet';
import { shelterRouter } from './routers/shelter';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  pet: petRouter,
  shelter: shelterRouter,
  adoptionApplication: adoptionApplicationRouter,
  test: exampleRouter,
});

export type AppRouter = typeof appRouter;
