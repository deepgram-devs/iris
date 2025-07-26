/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
import { getSlackApiKey } from "../../utils/getApiKey.js";
import { getWorkspaceBotToken } from "../../utils/getWorkspaceBotToken.js";
import { logger } from "../../utils/logger.js";
import { makeAiRequestOnSlack } from "../../utils/makeAiRequest.js";
import { trimSlackMessageFromEvent } from "../../utils/trimSlackMessage.js";
import { generateFeedbackBlocks } from "../blocks/generateFeedbackBlocks.js";
import type { Iris } from "../../interfaces/iris.js";
import type { SayFn } from "@slack/bolt";
import type {
  FileShareMessageEvent,
  GenericMessageEvent,
} from "@slack/web-api";

/**
 * Responds to a Slack DM message.
 * @param iris - Iris's instance.
 * @param message - The message payload from Slack.
 * @param say - The function to send a message back to the user.
 * @param teamId - The ID of the Slack team (workspace) the message is from.
 * @param enterpriseId - The ID of the Slack enterprise (if applicable).
 */
export const processSlackDmMessage = async(
  iris: Iris,
  message: GenericMessageEvent | FileShareMessageEvent,
  say: SayFn,
  teamId: string | undefined,
  enterpriseId: string | undefined,
): Promise<void> => {
  try {
    await logger(iris, `Processing Slack DM: ${JSON.stringify(message)}`);
    if (teamId === undefined && enterpriseId === undefined) {
      // We have to use `say` here because we cannot find a token without a team ID.
      await say("I could not find your workspace ID. Please try again.");
      return;
    }
    const botToken = await getWorkspaceBotToken(iris, teamId, enterpriseId);
    const { user } = await iris.slack.client.users.info({
      token: botToken,
      user:  message.user,
    });
    const apiKey = await getSlackApiKey(iris, teamId, enterpriseId);
    if (apiKey === null) {
      await iris.slack.client.chat.postMessage({
        channel: message.channel,
        // eslint-disable-next-line stylistic/max-len -- Long string.
        text:    "I could not determine how to authenticate this request. Please try again.",
        token:   botToken,
      });
      return;
    }
    const username
      = user?.profile?.display_name ?? user?.real_name ?? "Unknown User";
    const channelName = "Direct Messages";
    const response = await makeAiRequestOnSlack(
      iris,
      [ trimSlackMessageFromEvent(message) ],
      channelName,
      username,
      apiKey,
      botToken,
    );
    await iris.slack.client.chat.postMessage({
      blocks:    generateFeedbackBlocks(response),
      channel:   message.channel,
      text:      response,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      thread_ts: message.ts,
      token:     botToken,
    });
  } catch (error) {
    await errorHandler(
      iris,
      {
        error:          error,
        message:        "Error in processSlackDmMessage",
        slackChannelId: message.channel,
        slackThreadTs:  message.ts,
        teamId:         teamId,
      },
      {
        manuallySend: true,
      },
    );
  }
};
