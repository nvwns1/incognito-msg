import dbConnection from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import { createResponse } from "@/types/JsonResponse";
import options from "../../auth/[...nextauth]/options";
import UserModel, { IMessage } from "@/model/User.model";

export const GET = async () => {
  await dbConnection();
  const session = await getServerSession(options);
  const _user = session?.user as User;
  if (!session || !_user) {
    return createResponse({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match user by ID
      { $unwind: "$messages" }, // Unwind the message array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group back into messages array
    ]).exec();

    if (!user) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    if (user.length === 0) {
      return createResponse({
        success: true,
        message: "No messages found",
        status: 200,
      });
    }
    return createResponse({
      success: true,
      messages: user[0].messages as IMessage[],
      status: 200,
    });
  } catch (error) {
    console.error("Error getting messages", error);
    return createResponse({
      success: false,
      message: "Error getting messages",
      status: 500,
    });
  }
};
