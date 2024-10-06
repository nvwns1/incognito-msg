import { z } from "zod";
import { usernameSchema } from "./signUpSchema";

export const verifyEmailSchema = z.object({
  username: usernameSchema,
  code: z.string().length(6, "Code must be 6 characters"),
});
