import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { verifyEmailSchema } from "@/schemas/auth/verifyEmailSchema";
import { createResponse } from "@/types/JsonResponse";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const body = await request.json();

    const validationResult = verifyEmailSchema.safeParse(body);

    if (!validationResult.success) {
      return createResponse({
        success: false,
        message: "Invalid request body",
        status: 400,
      });
    }

    const { username, code } = validationResult.data;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return createResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }
    if (user.isVerified) {
      return createResponse({
        success: false,
        message: "Email already verified",
        status: 400,
      });
    }
    if (user.code !== code) {
      return createResponse({
        success: false,
        message: "Invalid code",
        status: 400,
      });
    }
    const currentDate = new Date();
    if (!user.codeExpiry || currentDate > user?.codeExpiry) {
      return createResponse({
        success: false,
        message: "Code expired",
        status: 400,
      });
    }
    user.code = "";
    user.codeExpiry = null;
    user.isVerified = true;
    await user.save();
    return createResponse({
      success: true,
      message: "Email verified",
      status: 201,
    });
  } catch (error) {
    console.error("Error verifying email", error);
    return createResponse({
      success: false,
      message: "Error verifying email",
      status: 500,
    });
  }
}
