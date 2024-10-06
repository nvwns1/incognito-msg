import dbConnection from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import { createResponse } from "@/types/JsonResponse";
import options from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";

export const GET = async () => {
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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "messages" } } },
    ]);
    if (!user || user.length === 0) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }
    return createResponse({
      success: true,
      messages: user[0].messages,
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
