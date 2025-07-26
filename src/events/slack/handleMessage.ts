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
import { getWorkspaceBotUser } from "../../utils/getWorkspaceBotUser.js";
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
 * @param enterpriseId - The ID of the Slack enterprise (if applicable).
 */
export const handleSlackMessage: SlackMessageCallback = async(
  iris,
  message,
  say,
  teamId,
  enterpriseId,
) => {
  try {
    if (message.subtype !== undefined && message.subtype !== "file_share") {
      return;
    }
    if (message.channel_type === "im") {
      if (isSlackMessageInThread(message)) {
        await processSlackThreadMessage(
          iris,
          message,
          say,
          teamId,
          enterpriseId,
        );
        return;
      }
      await processSlackDmMessage(iris, message, say, teamId, enterpriseId);
      return;
    }
    const installation = await iris.store.fetchInstallation({
      enterpriseId:        undefined,
      isEnterpriseInstall: false,
      teamId:              teamId ?? "",
    });
    const uuid = `<@${getWorkspaceBotUser(installation)}>`;
    await logger(
      iris,
      `Received message event in ${
        teamId ?? enterpriseId ?? "unknown workspace"
      }, checking for mention of \`${getWorkspaceBotUser(installation)}\``,
    );
    if (message.text === undefined) {
      return;
    }
    if (!message.text.includes(uuid)) {
      return;
    }
    if (isSlackMessageInThread(message)) {
      await processSlackThreadMessage(iris, message, say, teamId, enterpriseId);
      return;
    }
    await processSlackMentionMessage(iris, message, say, teamId, enterpriseId);
  } catch (error) {
    await errorHandler(
      iris,
      {
        enterpriseId:   enterpriseId,
        error:          error,
        message:        "Error in handleSlackMessage",
        slackChannelId: message.channel,
        teamId:         teamId,
      },
      { manuallySend: true },
    );
  }
};
