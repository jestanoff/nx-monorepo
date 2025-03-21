import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from 'superjson';

export const createTRPCContext = cache(() => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,

});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
