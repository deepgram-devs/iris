/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { WebhookClient } from "discord.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Sends an arbitrary message to the Slack log channel.
 * @param iris - Iris's instance.
 * @param message - The message to send.
 */
export const logger = async(iris: Iris, message: string): Promise<void> => {
  const channel = process.env.LOG_CHANNEL;
  if (channel !== undefined) {
    await iris.slack.client.chat.postMessage({
      channel: channel,
      text:    message,
    });
  }
  const hook = process.env.DISCORD_WEBHOOK;
  if (hook !== undefined) {
    const client = new WebhookClient({
      url: hook,
    });
    await client.send({
      avatarURL: "https://cdn.nhcarrigan.com/new-avatars/iris.png",
      content:   message,
      username:  "Iris Logger",
    });
  }
};
