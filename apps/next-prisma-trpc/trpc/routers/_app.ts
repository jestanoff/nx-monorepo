import { z } from "zod";
import { router, publicProcedure } from "../init";
import { prismaClient } from "@nx-monorepo/database";

export const appRouter = router({
  post: {
    all: publicProcedure.input(z.object({
      limit: z.number().min(1).max(50).default(50),
      cursor: z.number().optional(),
    })).query(async ({ ctx, input }) => {
      const posts = await prismaClient.post.findMany({
        include: { comments: true },
        take: input.limit,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { id: 'asc' },
      });

      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

      return { posts, nextCursor };
    }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        content: z.string(),
        title: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        return await prismaClient.post.update({
          where: { id: input.id },
          data: { content: input.content, title: input.title, },
        });
      }),
    byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      return await prismaClient.post.findUnique({
        where: { id: input.id },
        include: { comments: true },
      });
    }),
  },
  comment: {
    create: publicProcedure
      .input(z.object({ postId: z.string(), content: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prismaClient.comment.create({
          data: {
            postId: Number(input.postId),
            content: input.content,
          },
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      return await prismaClient.comment.delete({ where: { id: input.id } });
    }),
  },
});

export type AppRouter = typeof appRouter;
