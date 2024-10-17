"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResendCode, useVerifyEmail } from "@/hooks/data/useAuth";
import { toast } from "@/hooks/use-toast";
import { usernameSchema } from "@/schemas/auth/signUpSchema";
import { verifyEmailSchema } from "@/schemas/auth/verifyEmailSchema";
import { VerifyEmailT } from "@/utils/types/authType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const VerifyEmailPage = ({ params }: { params: { username: string } }) => {
  const { verifyEmailMutation, verifyEmailPending } = useVerifyEmail();
  const { resendCodeMutate, resendCodePending } = useResendCode();

  const form = useForm<VerifyEmailT>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      username: params.username,
      code: "",
    },
  });

  const onSubmit = async (data: VerifyEmailT) => {
    verifyEmailMutation(data);
  };

  const handleResend = async (): Promise<void> => {
    const validationResult = usernameSchema.safeParse({
      username: params.username,
    });
    if (!validationResult.success) {
      toast({
        title: "Error",
        description: "Username is invalid",
        variant: "destructive",
      });
      return;
    }
    if (!resendCodePending) resendCodeMutate(params.username);
  };

  return (
    <>
      <p className="mb-4">Verify Code to start your incognito adventure</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={verifyEmailPending}>
            {verifyEmailPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>

      <p>
        Don&apos;t receive code?{" "}
        <span
          onClick={handleResend}
          className="underline hover:text-gray-500 hover:cursor-pointer"
        >
          {resendCodePending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Resend"
          )}
        </span>
      </p>
    </>
  );
};

export default VerifyEmailPage;
