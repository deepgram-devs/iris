/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
/* eslint-disable @typescript-eslint/naming-convention -- There's enough properties in here that cannot be camelCase we may as well turn the rule off entirely.*/
import { errorHandler } from "./errorHandler.js";
import {
  formatDiscordMessages,
  formatSlackMessages,
} from "./formatMessages.js";
import { generatePrompt } from "./generatePrompt.js";
import { logger } from "./logger.js";
import type { Iris } from "../interfaces/iris.js";
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";
import type { Message } from "discord.js";

const makeAiRequest = async(
  iris: Iris,
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
): Promise<string> => {
  try {
    const request = await fetch(
      "https://gnosis.deepgram.com/v1/chat/completions",
      {
        body: JSON.stringify({
          messages:        messages,
          model:           "gpt-4o",
          response_format: { type: "text" },
          temperature:     1,
        }),
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type":  "application/json",
        },
        method: "POST",
      },
    );
    if (!request.ok) {
      const errorResponse = await request.text();
      throw new Error(errorResponse);
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- JSON doesn't accept a generic.
    const response = (await request.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    let result
      = response.choices[0]?.message.content
      ?? "There was an issue generating the response. Please try again later.";
    // We need to remove any frontmatter that the ai hallucinates.
    if (result.startsWith("---")) {
      const lines = result.split("\n");
      const firstIndex = lines.indexOf("---");
      const lastIndex
        = lines.slice(firstIndex + 1).indexOf("---") + firstIndex + 1;
      if (lastIndex !== -1 && firstIndex !== -1) {
        result = lines.slice(lastIndex + 1).join("\n");
      }
    }
    await logger(iris, `AI response: ${result}`);
    return result;
  } catch (error) {
    await errorHandler(
      iris,
      { error: error, message: "Error in makeAIRequest" },
      {},
    );
    // eslint-disable-next-line stylistic/max-len -- long string.
    return "There was an error when generating a response. Please notify Naomi.";
  }
};

/**
 * Formats an array of Slack messages, prepends a system message with our
 * generated prompt, and requests a chat completion from Gnosis.
 * @param iris - Iris' instance.
 * @param messages - The slack messages to include as the conversation.
 * @param channelName - The name of the channel the conversation occurred in.
 * @param username - The user whose message triggered an AI request.
 * @param apiKey - The Deepgram API key to authenticate the request with.
 * @param token - The Slack bot token to authenticate the request with.
 * @returns The response from Gnosis.
 */
const makeAiRequestOnSlack = async(
  iris: Iris,
  messages: Array<MinimalSlackMessage>,
  channelName: string,
  username: string,
  apiKey: string,
  token: string,
): Promise<string> => {
  const irisUser = await iris.slack.client.auth.test({ token });
  const irisUserId = irisUser.user_id;
  const formattedMessages = formatSlackMessages(
    messages,
    channelName,
    username,
    irisUserId ?? "Unknown User",
  );
  const allMessages = [
    {
      content: generatePrompt(username, "slack"),
      role:    "system",
    },
    ...formattedMessages,
  ];
  const result = await makeAiRequest(iris, allMessages, apiKey);
  return result;
};

/**
 * Formats an array of Discord messages, prepends a system message with our
 * generated prompt, and requests a chat completion from Gnosis.
 * @param iris - Iris' instance.
 * @param messages - The discord messages to include as the conversation.
 * @param channelName - The name of the channel the conversation occurred in.
 * @param username - The user whose message triggered an AI request.
 * @param apiKey - The Deepgram API key to authenticate the request with.
 * @returns The response from Gnosis.
 */
const makeAiRequestOnDiscord = async(
  iris: Iris,
  messages: Array<Message<true>>,
  channelName: string,
  username: string,
  apiKey: string,
): Promise<string> => {
  const irisUser = iris.discord.user;
  const irisUserId = irisUser?.id;
  const formattedMessages = formatDiscordMessages(
    messages,
    channelName,
    username,
    irisUserId ?? "Unknown User",
  );
  const allMessages = [
    {
      content: generatePrompt(username, "discord"),
      role:    "system",
    },
    ...formattedMessages,
  ];
  const result = await makeAiRequest(iris, allMessages, apiKey);
  return result;
};

export { makeAiRequestOnSlack, makeAiRequestOnDiscord };
