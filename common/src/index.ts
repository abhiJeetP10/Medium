import { z } from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(8),
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type SigninInput = z.infer<typeof signinInput>;

export const createPostInput = z.object({
    title: z.string(),
    content: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
});

export type UpdatePostInput = z.infer<typeof updatePostInput>;