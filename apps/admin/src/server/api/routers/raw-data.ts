import { createTRPCRouter, publicProcedure } from '../trpc';

export const rawDataRouter = createTRPCRouter({
  getAllRaws: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.rawPassing.findMany();
  })
});
