import { signInSchema } from "@/schemas/auth/signInSchema";
import { signUpSchema } from "@/schemas/auth/signUpSchema";
import * as z from "zod";

export type SignInFormValuesT = z.infer<typeof signInSchema>;
export type SignUpFormValuesT = z.infer<typeof signUpSchema>;
