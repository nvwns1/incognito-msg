"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IMessage } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import { useCallback, useEffect, useState } from "react";

const DashBoardPage = () => {
  const [message, setMessage] = useState<IMessage[]>([]);

  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/message/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
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

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessage();
  }, [fetchMessage, session]);

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
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((msg, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <p className="text-lg font-semibold mb-2">Message</p>
              <p>{msg.content}</p>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </div>
  );
};

export default DashBoardPage;
