import { createTRPCRouter } from '~/server/api/trpc';
import publicProcedure from '../procedures/publicProcedure';

export const petRouter = createTRPCRouter({
  getAllPets: publicProcedure.query(() => {
    return 'will return all pets';
  }),
});
