import { IMessage } from "@/model/User.model";

interface IResponse {
  success: boolean;
  message?: string;
  status: 200 | 201 | 400 | 401 | 404 | 500;
  isAcceptingMessages?: boolean;
  messages?: Array<IMessage>;
}
export function createResponse({
  success,
  message,
  status,
  isAcceptingMessages,
  messages,
}: IResponse) {
  return Response.json(
    { success, message, isAcceptingMessages, messages },
    { status }
  );
}
