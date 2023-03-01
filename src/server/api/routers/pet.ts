import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const petRouter = createTRPCRouter({
  getAllPets: publicProcedure.query(() => {
    return "will return all pets";
  }),
});
