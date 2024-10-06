import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import EmailComponent from "../../emails/EmailComponent";

export enum EmailTypeEnum {
  VERIFY = "Verify Email",
  RESET = "Reset Password",
}

export const emailMessage = {
  [EmailTypeEnum.VERIFY]:
    "Thank you for registering. Please use the following verification code to complete your registration",
  [EmailTypeEnum.RESET]:
    "Please use the following code to reset your password.",
} as const;

export type EmailMessageType = (typeof emailMessage)[EmailTypeEnum];

export async function sendEmail(
  username: string,
  type: EmailTypeEnum,
  email: string,
  code: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: type,
      react: EmailComponent({
        username,
        code,
        type,
        message: emailMessage[type],
      }),
    });
    return {
      success: true,
      message: "Email sent",
    };
  } catch (error) {
    console.log("Error sending email", error);
    return {
      success: false,
      message: "Error sending email",
    };
  }
}
