import dbConnection from "@/lib/dbConnection";
import UserModel, { IMessage } from "@/model/User.model";
import { sendMessageSchema } from "@/schemas/messages/sendMessageSchema";
import { createResponse } from "@/types/JsonResponse";

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnection();

  const validationResult = sendMessageSchema.safeParse(body);

  if (!validationResult.success) {
    return createResponse({
      success: false,
      message: "Invalid request body",
      status: 400,
    });
  }

  try {
    const { username, content } = validationResult.data;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    if (!user.isAcceptingMessages) {
      return createResponse({
        success: false,
        message: "User is not accepting messages",
        status: 400,
      });
    }

    const message: IMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(message);
    await user.save();

    return createResponse({
      success: true,
      message: "Message sent",
      status: 201,
    });
  } catch (error) {
    console.error("Error sending message", error);
    return createResponse({
      success: false,
      message: "Error sending message",
      status: 500,
    });
  }
}
