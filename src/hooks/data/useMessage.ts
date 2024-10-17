import { ApiResponse } from "@/types/ApiResponse";
import {
  changeAcceptMessagesApi,
  createMessageApi,
  deleteMessageApi,
  getAcceptMessagesApi,
  getMessagesApi,
} from "@/utils/apis/messageApis";
import { createMessageFormValuesT } from "@/utils/types/messageType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "../use-toast";
import { handleAxiosError } from "@/utils/errorHandler";
import { IMessage } from "@/model/User.model";

export const useMessages = () => {
  const queryClient = useQueryClient();

  // Create Message
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

  // Fetch Messages
  const { data: messages, isLoading: messagesFetching } = useQuery({
    queryKey: ["messages"],
    queryFn: getMessagesApi,
  });

  // Delete Message
  const { mutate: deleteMessageMutate } = useMutation({
    mutationFn: deleteMessageApi,
    // Optimistically update the message List
    onMutate: async (messageId: string) => {
      // Cancel any outgoing queries for messages
      await queryClient.cancelQueries({ queryKey: ["messages"] });

      // Get the current messages
      const previousMessages = queryClient.getQueryData<IMessage[]>([
        "messages",
      ]);

      // Optimistically update the message List
      queryClient.setQueryData<IMessage[]>(["messages"], (old) =>
        old?.filter((msg) => msg._id !== messageId)
      );

      return { previousMessages };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] }); // Refetch messages to ensure state is consistent
      toast({ title: "Success", description: "Message deleted" });
    },

    onError: (error: AxiosError, messageId, context) => {
      // If there was an error, roll back to the previous messages
      queryClient.setQueryData<IMessage[]>(
        ["messages"],
        context?.previousMessages
      );
      // Handle the error (logging, displaying toast, etc.)
      handleAxiosError(error);
    },
  });

  // Get Accepting Message flag
  const { data: isAcceptingMessage } = useQuery({
    queryKey: ["acceptMessages"],
    queryFn: getAcceptMessagesApi,
  });

  // Change the Accepting Message flag
  const { mutate: switchChangeMutate, isPending: switchChangePending } =
    useMutation<ApiResponse, AxiosError, boolean>({
      mutationFn: async (isAcceptingMessages: boolean) => {
        return changeAcceptMessagesApi(isAcceptingMessages);
      },
      onSuccess: (data) => {
        toast({ title: "Success", description: data.message });
      },
      onError: handleAxiosError,
    });

  return {
    messages,
    messagesFetching,
    createMessageMutate,
    createMessagePending,
    deleteMessageMutate,
    isAcceptingMessage,
    switchChangeMutate,
    switchChangePending,
  };
};
