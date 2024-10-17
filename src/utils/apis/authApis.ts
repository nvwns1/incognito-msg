import axios from "axios";
import { SignUpFormValuesT, VerifyEmailT } from "../types/authType";
import { ApiResponse } from "@/types/ApiResponse";

export const signUpUser = async (
  data: SignUpFormValuesT
): Promise<ApiResponse> => {
  const response = await axios.post("/api/auth/sign-up", data);
  return response.data;
};

export const verifyUser = async (data: VerifyEmailT): Promise<ApiResponse> => {
  const response = await axios.post("/api/auth/verify-email", data);
  return response.data;
};

export const resendCode = async (username: string): Promise<ApiResponse> => {
  const response = await axios.post("/api/auth/regenerate-verify-email", {
    username,
  });
  return response.data;
};
