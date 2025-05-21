/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Iris } from "../interfaces/iris.js";

/**
 * Sends an arbitrary message to the Slack log channel.
 * @param iris - Iris's instance.
 * @param message - The message to send.
 */
export const logger = async(iris: Iris, message: string): Promise<void> => {
  const channel = process.env.SLACK_LOG_CHANNEL;
  if (channel !== undefined) {
    await iris.slack.client.chat.postMessage({
      channel: channel,
      text:    message,
    });
  }
};
