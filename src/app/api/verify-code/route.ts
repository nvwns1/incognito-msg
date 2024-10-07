import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const body = await request.json();
    const decodeUsername = decodeURIComponent(body.username);
    body.username = decodeUsername;
    const result = verifySchema.safeParse(body);
    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      return Response.json(
        { success: false, error: codeErrors.join(", ") },
        { status: 400 }
      );
    }
    const { code, username } = result.data;

    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "User Verified" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code has Expired. Please SignUp again",
        },
        { status: 400 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid Code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Verify code" + error);
    return Response.json(
      { success: false, message: "Error Verifying Code" },
      { status: 500 }
    );
  }
}
