"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "../use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { handleAxiosError } from "@/utils/errorHandler";
import { signIn } from "next-auth/react";
import { signUpUser } from "@/utils/apis/authApis";
import { SignInFormValuesT, SignUpFormValuesT } from "@/utils/types/authType";

export const useSignIn = () => {
  const { replace } = useRouter();
  const { mutate: signInFn, isPending: signInPending } = useMutation({
    mutationFn: async (loginData: SignInFormValuesT) => {
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
    SignUpFormValuesT
  >({
    mutationFn: async (data: SignUpFormValuesT) => {
      return await signUpUser(data);
    },
    onSuccess: (data: ApiResponse, variables: SignUpFormValuesT) => {
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
