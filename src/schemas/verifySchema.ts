import { z } from "zod";
import { userNameValidation } from "./signUpSchema";

export const verifySchema = z.object({
  username: userNameValidation,
  code: z.string().length(6, "Code must be 6 characters"),
});
