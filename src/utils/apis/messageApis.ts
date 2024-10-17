import axios from "axios";
import { createMessageFormValuesT } from "../types/messageType";
import { ApiResponse } from "@/types/ApiResponse";

export const createMessageApi = async (data: createMessageFormValuesT) => {
  const response = await axios.post("/api/message/send-message", data);
  return response.data;
};

export const getMessagesApi = async () => {
  const { data } = await axios.get<ApiResponse>("/api/message/get-messages");
  return data.messages;
};

export const deleteMessageApi = async (messageId: string) => {
  const response = await axios.delete<ApiResponse>(
    `/api/message/delete-message/${messageId}`
  );
  return response.data;
};

export const getAcceptMessagesApi = async () => {
  const { data } = await axios.get<ApiResponse>("/api/message/accept-message");

  return data.isAcceptingMessages;
};

export const changeAcceptMessagesApi = async (value: boolean) => {
  const { data } = await axios.post<ApiResponse>(
    "/api/message/accept-message",
    { isAcceptingMessages: value }
  );

  return data;
};
