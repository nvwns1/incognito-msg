import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export const handleAxiosError = (error: AxiosError) => {
  console.error("Error in signup: " + error);
  const axiosError = error as AxiosError<ApiResponse>;
  const errorMessage = axiosError.response?.data.message;
  toast({
    title: "Error",
    description: errorMessage ?? "Something went wrong",
    variant: "destructive",
  });
};
