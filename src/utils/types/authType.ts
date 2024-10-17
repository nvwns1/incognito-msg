import { signInSchema } from "@/schemas/auth/signInSchema";
import { signUpSchema } from "@/schemas/auth/signUpSchema";
import { verifyEmailSchema } from "@/schemas/auth/verifyEmailSchema";
import * as z from "zod";

export type SignInFormValuesT = z.infer<typeof signInSchema>;
export type SignUpFormValuesT = z.infer<typeof signUpSchema>;
export type VerifyEmailT = z.infer<typeof verifyEmailSchema>;
