import type { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse.js";
import type { Iris } from "../interfaces/iris.js";
import { formatSlackMessages } from "./formatMessages.js";
import { generatePrompt } from "./generatePrompt.js";
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";

const makeAiRequest = async (messages: { role: string; content: string }[]) => {
  const request = await fetch(
    "https://gnosis.deepgram.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GNOSIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 1,
        response_format: { type: "text" },
        messages,
      }),
    }
  );
  if (!request.ok) {
    const errorResponse = await request.text();
    console.error("Error from Gnosis:", errorResponse);
    return "There was an error generating a response. Please notify Naomi.";
  }
  const response = await request.json();
  return response.choices[0].message.content;
};

export const makeAiRequestOnSlack = async (
  iris: Iris,
  messages: MinimalSlackMessage[],
  channelName: string,
  username: string
): Promise<string> => {
  const irisUserId = (await iris.slack.client.auth.test()).user_id;
  const formattedMessages = await formatSlackMessages(
    messages,
    channelName,
    username,
    irisUserId ?? "Unknown User"
  );
  const allMessages = [
    {
      role: "system",
      content: generatePrompt(username, "slack"),
    },
    ...formattedMessages,
  ];
  const result = await makeAiRequest(allMessages);
  return result;
};
