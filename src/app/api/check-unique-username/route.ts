import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { createResponse } from "@/types/JsonResponse";

import { usernameSchema } from "@/schemas/auth/signUpSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  await dbConnection();
  try {
    // /api/check-unique-username?username=example
    const { searchParams } = new URL(request.url);

    const data = { username: searchParams.get("username") };
    console.log(data);

    const validationResult = usernameQuerySchema.safeParse(data);
    if (!validationResult.success) {
      return createResponse({
        success: false,
        message: "Invalid request body",
        status: 400,
      });
    }

    const { username } = validationResult.data;
    const user = await UserModel.findOne({ username });
    if (user) {
      return createResponse({
        success: false,
        message: "Username already exists",
        status: 400,
      });
    }

    return createResponse({
      success: true,
      message: "Username is unique",
      status: 200,
    });
  } catch (error) {
    console.error("Error checking username", error);
    return createResponse({
      success: false,
      message: "Error checking username",
      status: 500,
    });
  }
}
