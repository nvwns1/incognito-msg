import { ApiResponse } from "@/types/ApiResponse";
import { createMessageApi } from "@/utils/apis/messageApis";
import { createMessageFormValuesT } from "@/utils/types/messageType";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "../use-toast";
import { handleAxiosError } from "@/utils/errorHandler";

export const useCreateMessage = () => {
  const { mutate: createMessageMutate, isPending: createMessagePending } =
    useMutation<ApiResponse, AxiosError, createMessageFormValuesT>({
      mutationFn: async (data) => {
        return await createMessageApi(data);
      },
      onSuccess: (data) => {
        toast({ title: "Success", description: data.message });
      },
      onError: (err) => {
        handleAxiosError(err);
      },
    });

  return { createMessageMutate, createMessagePending };
};
