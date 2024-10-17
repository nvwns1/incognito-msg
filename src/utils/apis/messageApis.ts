import axios from "axios";
import { createMessageFormValuesT } from "../types/messageType";

export const createMessageApi = async (data: createMessageFormValuesT) => {
  const response = await axios.post("/api/message/send-message", data);
  return response.data;
};
