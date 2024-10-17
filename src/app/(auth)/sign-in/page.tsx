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
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/auth/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSignIn } from "@/hooks/data/useAuth";
import { SignInFormValuesT } from "@/utils/types/authType";

const SignInPage = () => {
  const { signInFn, signInPending } = useSignIn();

  const form = useForm<SignInFormValuesT>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValuesT) => {
    signInFn(data);
  };
  return (
    <>
      <p className="mb-4">Login to start your incognito adventure</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username / Email</FormLabel>
                <FormControl>
                  <Input placeholder="Username/ Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {signInPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
      <p>
        Don&apos;t have an account?{" "}
        <Link className="underline hover:text-gray-500" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default SignInPage;
