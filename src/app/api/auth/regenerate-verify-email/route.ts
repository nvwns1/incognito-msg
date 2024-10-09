import { EmailTypeEnum, sendEmail } from "@/helpers/sendEmail";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { createResponse } from "@/types/JsonResponse";

// todo
export async function POST(request: Request) {
  await dbConnection();
  const body = await request.json();

  const { username } = body;

  try {
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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = code;
    user.codeExpiry = new Date(Date.now() + 1000 * 60 * 60);

    // Send Email
    const response = await sendEmail(
      user.username,
      EmailTypeEnum.VERIFY,
      user.email,
      code
    );

    if (!response.success) {
      return createResponse({
        success: false,
        message: "Failed to send email",
        status: 500,
      });
    }

    await user.save();

    return createResponse({
      success: true,
      message: "Code sent successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error in regenerating code: " + error);
    return createResponse({
      success: false,
      message: "Something went wrong",
      status: 500,
    });
  }
}
