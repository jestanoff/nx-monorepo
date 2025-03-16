"use server";

import { z } from "zod";
import { prismaClient } from "@nx-monorepo/database";

const createCommentSchema = z.object({ postId: z.number(), content: z.string() });
const deleteCommentSchema = z.object({ id: z.number() });

export async function createComment(postId: number, content: string) {
  const validatedFields = createCommentSchema.safeParse({ postId, content })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return await prismaClient.comment.create({
    data: {
      postId,
      content,
    },
  });
}

export async function deleteComment(id: number) {
  const validatedFields = deleteCommentSchema.safeParse({ id })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return await prismaClient.comment.delete({ where: { id } });
}
