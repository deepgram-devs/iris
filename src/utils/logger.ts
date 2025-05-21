/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Iris } from "../interfaces/iris.js";

export const logger = async (iris: Iris, message: string): Promise<void> => {
  const channel = process.env.SLACK_LOG_CHANNEL;
  if (channel) {
    await iris.slack.client.chat.postMessage({
      channel,
      text: message,
    });
  }
};
