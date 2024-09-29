import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must not be atleast 10 characters" })
    .max(300, { message: "Message must not be atmost 300 characters" }),
});
