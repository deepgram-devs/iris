/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { appendSlackFrontmatter } from "../modules/appendFrontmatter.js";
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";

/**
 * Takes an array of Slack messages and formats them into the
 * typical LLM "role" and "content" format. Also appends the frontmatter
 * to each message.
 * @param messages - The messages to format.
 * @param channelName - The name of the channel the messages were sent in.
 * @param username - The username of the person who sent the messages.
 * @param irisId - Iris' bot id.
 * @returns The formatted messages.
 */
const formatSlackMessages = (
  messages: Array<MinimalSlackMessage>,
  channelName: string,
  username: string,
  irisId: string,
): Array<{ role: string; content: string }> => {
  const formattedMessages = messages.map((message) => {
    const role = message.userId === irisId
      ? "assistant"
      : "user";
    return {
      content: appendSlackFrontmatter(message, channelName, username, irisId),
      role:    role,
    };
  });
  return formattedMessages;
};

export { formatSlackMessages };
