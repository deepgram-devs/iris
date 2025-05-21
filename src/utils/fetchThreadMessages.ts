/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "./errorHandler.js";
import type { Iris } from "../interfaces/iris.js";
import type { MessageElement }
  from "@slack/web-api/dist/types/response/ConversationsRepliesResponse.js";

/**
 * Fetches the conversation history for a given thread in a Slack channel.
 * @param iris - The Iris instance.
 * @param channelId - The ID of the Slack channel where the thread is.
 * @param threadTs - The timestamp of the thread to fetch messages from.
 * @returns An array of messages in the thread.
 */
const fetchSlackThreadMessages = async(
  iris: Iris,
  channelId: string,
  threadTs: string,
): Promise<Array<MessageElement>> => {
  try {
    const result = await iris.slack.client.conversations.replies({
      channel: channelId,
      ts:      threadTs,
    });

    if (!result.ok) {
      throw new Error(
        `Failed to fetch thread messages: ${result.error ?? "Unknown error"}`,
      );
    }

    return result.messages ?? [];
  } catch (error) {
    await errorHandler(
      iris,
      {
        error:          error,
        message:        "Error in fetchSlackThreadMessages",
        slackChannelId: channelId,
        slackThreadTs:  threadTs,
      },
      {},
    );
    return [];
  }
};

export { fetchSlackThreadMessages };
