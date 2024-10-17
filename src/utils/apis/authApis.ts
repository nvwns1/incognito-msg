import axios from "axios";
import { SignUpFormValuesT } from "../types/authType";
import { ApiResponse } from "@/types/ApiResponse";

export const signUpUser = async (
  data: SignUpFormValuesT
): Promise<ApiResponse> => {
  return await axios.post("/api/auth/sign-up", data);
};
