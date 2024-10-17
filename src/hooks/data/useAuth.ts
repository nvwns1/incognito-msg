"use client";

import { signUpSchema } from "@/schemas/auth/signUpSchema";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "../use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { handleAxiosError } from "@/utils/errorHandler";
import { signInSchema } from "@/schemas/auth/signInSchema";
import { signIn } from "next-auth/react";

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export const useSignIn = () => {
  const { replace } = useRouter();
  const { mutate: signInFn, isPending: signInPending } = useMutation({
    mutationFn: async (loginData: SignInFormValues) => {
      return await signIn("credentials", {
        username: loginData.identifier,
        password: loginData.password,
        redirect: false,
      });
    },
    onSuccess: (result: any) => {
      console.log(result);
      if (result?.ok) {
        replace("/dashboard");
      }

      if (result?.error) {
        if (result.error == "CredentialsSignin") {
          toast({
            title: "Login Failed",
            description: "Incorrect username of password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      }
    },
  });

  return { signInFn, signInPending };
};

export const useSignUp = () => {
  const { replace } = useRouter();
  const { mutate: signUp, isPending: signUpPending } = useMutation<
    ApiResponse,
    AxiosError,
    SignUpFormValues
  >({
    mutationFn: async (data: SignUpFormValues) => {
      return await axios.post("/api/auth/sign-up", data);
    },
    onSuccess: (data: ApiResponse, variables: SignUpFormValues) => {
      const { username } = variables; // username is part of SignUpFormValues
      toast({ title: "Success", description: data.message });
      replace(`/verify-email/${username}`);
    },
    onError: (error: AxiosError) => {
      handleAxiosError(error);
    },
  });

  return { signUp, signUpPending };
};
