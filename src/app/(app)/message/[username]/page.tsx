"use client";

import React from "react";
import { sendMessageSchema } from "@/schemas/messages/sendMessageSchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type createMessageFormValues = z.infer<typeof sendMessageSchema>;

const CreateMessage = ({ params }: { params: { username: string } }) => {
  const username = params.username;
  const { toast } = useToast();

  const form = useForm<createMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      username,
    },
  });

  const onSubmit = async (data: createMessageFormValues) => {
    const { content } = data;
    try {
      const response = await axios.post("/api/message/send-message", {
        username,
        content,
      });
      toast({ title: "Success", description: response.data.message });

      form.setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your Message here"
                      className="resize-none w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Message will be sent to{" "}
                    <span className="font-bold">@{username}</span>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateMessage;
