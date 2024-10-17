"use client";

import { signUpSchema } from "@/schemas/auth/signUpSchema";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "../use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { handleAxiosError } from "@/utils/errorHandler";

type SignUpFormValues = z.infer<typeof signUpSchema>;

const useSignIn = () => {};

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
