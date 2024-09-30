import dbConnection from "@/lib/dbConnection";
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
  }
}
