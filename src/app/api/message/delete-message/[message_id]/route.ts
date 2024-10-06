import options from "@/app/api/auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { createResponse } from "@/types/JsonResponse";
import { getServerSession, User } from "next-auth";

export async function Delete(
  request: Request,
  { params }: { params: { message_id: string } }
) {
  await dbConnection();

  const message_id = params.message_id;

  const session = await getServerSession(options);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return createResponse({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: message_id } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return createResponse({
        success: false,
        message: "Message not found",
        status: 404,
      });
    }

    return createResponse({
      success: true,
      message: "Message deleted",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting message", error);
    return createResponse({
      success: false,
      message: "Error deleting message",
      status: 500,
    });
  }
}
