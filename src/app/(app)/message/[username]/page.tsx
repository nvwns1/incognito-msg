"use client";

import React from "react";
import { sendMessageSchema } from "@/schemas/messages/sendMessageSchema";
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
import { useMessages } from "@/hooks/data/useMessage";
import { createMessageFormValuesT } from "@/utils/types/messageType";

const CreateMessage = ({ params }: { params: { username: string } }) => {
  const username = params.username;

  const { createMessageMutate, createMessagePending } = useMessages();

  const form = useForm<createMessageFormValuesT>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      username,
    },
  });

  const onSubmit = async (data: createMessageFormValuesT) => {
    createMessageMutate(data);
    form.reset();
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
            <Button type="submit" disabled={createMessagePending}>
              {createMessagePending ? "Sending..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateMessage;
