"use client";
import MessageCard from "@/components/component/MessageCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { IMessage } from "@/model/User.model";
import { isAcceptingMessageSchema } from "@/schemas/messages/isAcceptingMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashBoardPage = () => {
  const [message, setMessage] = useState<IMessage[]>([]);
  const { data: session } = useSession();

  const router = useRouter();

  const { toast } = useToast();

  const form = useForm({ resolver: zodResolver(isAcceptingMessageSchema) });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "/api/message/accept-message"
      );
      const { isAcceptingMessages } = response.data;
      setValue("acceptMessages", isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  }, [setValue, toast]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/message/accept-message",
        {
          isAcceptingMessages: !acceptMessages,
        }
      );
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const fetchMessage = useCallback(async () => {
    try {
      const { data } = await axios.get<ApiResponse>(
        "/api/message/get-messages"
      );
      const { messages } = data;
      setMessage(messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleMessageDelete = (messageId: string) => {
    setMessage((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
  };

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessage();
    fetchAcceptMessages();
  }, [fetchMessage, session, router, fetchAcceptMessages]);

  if (!session || !session.user) {
    return <div></div>;
  }

  const user = session?.user;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/message/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl ">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={() => copyToClipboard()}>Copy</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            id="accept-message"
          />
          <Label htmlFor="accept-message">
            Accept Message: {acceptMessages ? "ON" : "OFF"}
          </Label>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {user && message.length > 0 ? (
          message.map((msg, index) => (
            <MessageCard
              key={index}
              message={msg}
              onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </div>
  );
};

export default DashBoardPage;
