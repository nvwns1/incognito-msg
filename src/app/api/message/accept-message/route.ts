import dbConnection from "@/lib/dbConnection";
import UserModel, { IUser } from "@/model/User.model";
import { createResponse } from "@/types/JsonResponse";
import options from "../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import { isAcceptingMessageSchema } from "@/schemas/messages/isAcceptingMessageSchema";

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = isAcceptingMessageSchema.safeParse(body);
  if (!validationResult.success) {
    return createResponse({
      success: false,
      message: "Invalid request body",
      status: 400,
    });
  }

  const { isAcceptingMessages } = validationResult.data;
  try {
    await dbConnection();
    const session = await getServerSession(options);
    const user = session?.user as User;
    if (!session || !user) {
      return createResponse({
        success: false,
        message: "Unauthorized",
        status: 401,
      });
    }

    const userId = user._id;
    const updatedUser = (await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessages,
    })) as IUser;

    if (!updatedUser) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return createResponse({
      success: true,
      message: "Updated accepting message",
      status: 200,
    });
  } catch (error) {
    console.error("Error updating accepting message:" + error);
    return createResponse({
      success: false,
      message: "Error updating accepting message",
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await dbConnection();

    const session = await getServerSession(options);

    const user = session?.user as User;
    if (!session || !user) {
      return createResponse({
        success: false,
        message: "Unauthorized",
        status: 401,
      });
    }

    const userId = user._id;
    const foundUser = (await UserModel.findById(userId)) as IUser;
    if (!foundUser) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return createResponse({
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessages,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return createResponse({
      success: false,
      message: "Error checking accepting message",
      status: 500,
    });
  }
}
