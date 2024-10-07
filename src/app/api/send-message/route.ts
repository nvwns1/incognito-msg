import dbConnection from "@/lib/dbConnection";
import UserModel, { IMessage } from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOneAndUpdate(username);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 400 }
      );
    }

    const message = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(message as IMessage);
    await user.save();
    return Response.json(
      { success: true, message: "Message sent" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error: Failed to send message",
      },
      { status: 500 }
    );
  }
}
