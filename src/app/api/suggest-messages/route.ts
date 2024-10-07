import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Define the prompt as a message from the user
  const promptMessage = {
    role: "user",
    content:
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive questions, focusing instead on universal themes that encourage friendly interaction.",
  };

  // Append the prompt message to the messages array
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: convertToCoreMessages([...messages, promptMessage]), // Include the prompt
  });

  return result.toDataStreamResponse();
}
