import dbConnection from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();

  const session = await getServerSession(options);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = user.id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accept Message updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error: Failed to update accept Message",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnection();
  const session = await getServerSession(options);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error: Failed to get accept Message",
      },
      { status: 500 }
    );
  }
}
