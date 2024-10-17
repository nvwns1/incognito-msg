"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "../use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { handleAxiosError } from "@/utils/errorHandler";
import { signIn } from "next-auth/react";
import { resendCode, signUpUser, verifyUser } from "@/utils/apis/authApis";
import {
  SignInFormValuesT,
  SignUpFormValuesT,
  VerifyEmailT,
} from "@/utils/types/authType";

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

export const useVerifyEmail = () => {
  const { replace } = useRouter();

  const { mutate: verifyEmailMutation, isPending: verifyEmailPending } =
    useMutation<ApiResponse, AxiosError, VerifyEmailT>({
      mutationFn: async (data: VerifyEmailT) => {
        return await verifyUser(data);
      },
      onSuccess: (data: ApiResponse) => {
        toast({ title: "Success", description: data.message });
        replace("/sign-in");
      },
      onError: (error) => {
        handleAxiosError(error);
      },
    });

  return { verifyEmailMutation, verifyEmailPending };
};

export const useResendCode = () => {
  const { mutate: resendCodeMutate, isPending: resendCodePending } =
    useMutation<ApiResponse, AxiosError, string>({
      mutationFn: async (username: string) => {
        return resendCode(username);
      },
      onSuccess: (data) => {
        console.log(data);
        console.log(data.message);
        toast({ title: "Success", description: data.message });
      },
    });

  return { resendCodeMutate, resendCodePending };
};
