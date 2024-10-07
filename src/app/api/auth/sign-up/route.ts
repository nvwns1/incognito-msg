import { EmailTypeEnum, sendEmail } from "@/helpers/sendEmail";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { signUpSchema } from "@/schemas/auth/signUpSchema";
import { createResponse } from "@/types/JsonResponse";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const body = await request.json();

    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      return createResponse({
        success: false,
        message: "Invalid request body",
        status: 400,
      });
    }

    const { email, username, password } = validationResult.data;
    const usernameExist = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (usernameExist) {
      return createResponse({
        success: false,
        message: "Username already exists",
        status: 400,
      });
    }
    const existedUserByEmail = await UserModel.findOne({ email });
    if (existedUserByEmail?.isVerified) {
      return createResponse({
        success: false,
        message: "Email already exists",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const dateAfterOneHour = new Date();
    dateAfterOneHour.setHours(dateAfterOneHour.getHours() + 1);

    // Send email with code to user
    const response = await sendEmail(
      username,
      EmailTypeEnum.VERIFY,
      email,
      code
    );

    if (!response.success) {
      return createResponse({
        success: false,
        message: "Error sending email",
        status: 500,
      });
    }

    if (existedUserByEmail && !existedUserByEmail.isVerified) {
      existedUserByEmail.password = hashedPassword;
      existedUserByEmail.code = code;
      existedUserByEmail.codeExpiry = dateAfterOneHour;
      await existedUserByEmail.save();
    } else {
      const user = await UserModel.create({
        email,
        username,
        password: hashedPassword,
        code,
        codeExpiry: dateAfterOneHour,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
      });
      await user.save();
    }

    return createResponse({
      success: true,
      message: "User Registered. Please Verify your email.",
      status: 201,
    });
  } catch (error) {
    console.error("Error signing up", error);
    return createResponse({
      success: false,
      message: "Error signing up",
      status: 500,
    });
  }
}
