import { sendMessageSchema } from "@/schemas/messages/sendMessageSchema";
import * as z from "zod";

export type createMessageFormValuesT = z.infer<typeof sendMessageSchema>;
