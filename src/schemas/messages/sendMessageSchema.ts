import { usernameSchema } from "../auth/signUpSchema";
import { z } from "zod";

export const sendMessageSchema = z.object({
  username: usernameSchema,
  content: z.string().min(2, "Message must be more than 2 characters"),
});
