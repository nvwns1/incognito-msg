import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
});
