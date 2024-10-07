import dbConnection from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnection();

  const session = await getServerSession(options);
  const user = session?.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error: Failed to get messages",
      },
      { status: 500 }
    );
  }
}
