import dbConnection from "@/lib/dbConnection";
<<<<<<< HEAD
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
=======
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({ username: userNameValidation });

export async function GET(request: Request) {
  await dbConnection();

  try {
    // GET THE URL
    const { searchParams } = new URL(request.url);

    // For Zod we do object
    const queryParam = { username: searchParams.get("username") };
    // Validate with Zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          error:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Query Parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, error: "Username Already Exists" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, error: "Username is Available" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Checking Username", error);
    return Response.json(
      { success: false, error: "Error Checking Username" },
      { status: 500 }
    );
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
  }
}
