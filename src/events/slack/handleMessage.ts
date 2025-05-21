/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { isSlackMessageInThread } from "../../utils/typeguards.js";
import type { SlackMessageCallback } from "../../interfaces/slackEventCallbacks.js";
import { processSlackDmMessage } from "../../modules/slack/processDmMessage.js";
import { processSlackMentionMessage } from "../../modules/slack/processMentionMessage.js";
import { processSlackThreadMessage } from "../../modules/slack/processThreadMessage.js";

/**
 * Slack message event listener. Checks if the message meets the criteria to trigger a response:
 * - Message must be in a DM with the bot OR
 * - Message must mention/tag the bot.
 * @param iris - Iris's instance.
 * @param message - The message payload from Slack.
 * @param say - The function to send a message back to the user.
 */
export const handleSlackMessage: SlackMessageCallback = async(iris, message, say) => {
  if (message.subtype !== undefined && message.subtype !== "file_share") {
    return;
  }
  if (message.channel_type === "im") {
    if (isSlackMessageInThread(message)) {
      await processSlackThreadMessage(iris, message, say);
      return;
    }
    processSlackDmMessage(iris, message, say);
    return;
  }
  const uuid = `<@${process.env.BOT_USER_ID ?? ""}>`;
  if (message.text === undefined) {
    return;
  }
  if (!message.text.includes(uuid)) {
    return;
  }
  if (isSlackMessageInThread(message)) {
    await processSlackThreadMessage(iris, message, say);
    return;
  }
  await processSlackMentionMessage(iris, message, say);
};
