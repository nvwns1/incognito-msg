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
import { useToast } from "@/hooks/use-toast";
import { verifyEmailSchema } from "@/schemas/auth/verifyEmailSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyEmailPage = ({ params }: { params: { username: string } }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      username: params.username,
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => {
    try {
      const { username, code } = data;
      const response = await axios.post("/api/auth/verify-email", {
        username,
        code,
      });
      toast({ title: "Success", description: response.data.message });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verify email: " + error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleResend = async (): Promise<void> => {
    try {
      const response = await axios.post("/api/auth/regenerate-verify-email", {
        username: params.username,
      });
      toast({ title: "Success", description: response.data.message });
    } catch (error) {
      console.error("Error in regenerating code: " + error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: "Error",
        description: errorMessage ?? "Something went wrong",
        variant: "destructive",
      });
    }
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <p>
        Don&apos;t receive code?{" "}
        <span
          onClick={handleResend}
          className="underline hover:text-gray-500 hover:cursor-pointer"
        >
          Resend
        </span>
      </p>
    </>
  );
};

export default VerifyEmailPage;
