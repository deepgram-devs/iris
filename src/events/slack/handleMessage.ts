/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { processSlackDmMessage } from "../../modules/slack/processDmMessage.js";
import { processSlackMentionMessage }
  from "../../modules/slack/processMentionMessage.js";
import { processSlackThreadMessage }
  from "../../modules/slack/processThreadMessage.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { logger } from "../../utils/logger.js";
import { isSlackMessageInThread } from "../../utils/typeguards.js";
import type { SlackMessageCallback }
  from "../../interfaces/slackEventCallbacks.js";

/**
 * Slack message event listener. Checks if the message meets the criteria to trigger a response:
 * - Message must be in a DM with the bot OR
 * - Message must mention/tag the bot.
 * @param iris - Iris's instance.
 * @param message - The message payload from Slack.
 * @param say - The function to send a message back to the user.
 * @param teamId - The ID of the Slack team (workspace) the message is from.
 */
// eslint-disable-next-line max-statements -- This function is long, but it handles multiple cases.
export const handleSlackMessage: SlackMessageCallback = async(
  iris,
  message,
  say,
  teamId,
) => {
  try {
    if (message.subtype !== undefined && message.subtype !== "file_share") {
      return;
    }
    if (message.channel_type === "im") {
      if (isSlackMessageInThread(message)) {
        await processSlackThreadMessage(iris, message, say, teamId);
        return;
      }
      await processSlackDmMessage(iris, message, say, teamId);
      return;
    }
    const installation = await iris.store.fetchInstallation({
      enterpriseId:        undefined,
      isEnterpriseInstall: false,
      teamId:              teamId ?? "",
    });
    const uuid = `<@${installation.bot?.userId ?? process.env.BOT_USER_ID ?? ""}>`;
    await logger(
      iris,
      `Received message event in ${teamId ?? "unknown team"}, checking for mention of \`${installation.bot?.userId ?? process.env.BOT_USER_ID ?? ""}\``,
    );
    if (message.text === undefined) {
      return;
    }
    if (!message.text.includes(uuid)) {
      return;
    }
    if (isSlackMessageInThread(message)) {
      await processSlackThreadMessage(iris, message, say, teamId);
      return;
    }
    await processSlackMentionMessage(iris, message, say, teamId);
  } catch (error) {
    await errorHandler(
      iris,
      {
        error:          error,
        message:        "Error in handleSlackMessage",
        slackChannelId: message.channel,
        teamId:         teamId,
      },
      { say },
    );
  }
};
