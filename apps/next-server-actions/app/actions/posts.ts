"use server";

import { z } from "zod";
import { prismaClient } from "@nx-monorepo/database";

export async function listPosts(limit: number, cursor?: number) {
  const validatedFields = z.object({
    limit: z.number().min(1).max(50).default(50),
    cursor: z.number().optional(),
  }).safeParse({ limit, cursor })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const posts = await prismaClient.post.findMany({
    include: { comments: true },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' },
  });

  const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

  return { posts, nextCursor };
}

export async function updatePost(id: number, content: string, title: string) {
  const validatedFields = z.object({
    id: z.number(),
    content: z.string(),
    title: z.string()
  }).safeParse({ id, content, title })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return await prismaClient.post.update({
    where: { id },
    data: { content, title },
  });
}

export async function getPostById(id: number) {
  const validatedFields = z.object({ id: z.number() }).safeParse({ id })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return await prismaClient.post.findUnique({
    where: { id },
    include: { comments: true },
  });
}

