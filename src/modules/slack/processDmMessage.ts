/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
import { getSlackApiKey } from "../../utils/getApiKey.js";
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
 */
export const processSlackDmMessage = async(
  iris: Iris,
  message: GenericMessageEvent | FileShareMessageEvent,
  say: SayFn,
  teamId?: string,
): Promise<void> => {
  try {
    await logger(iris, `Processing Slack DM: ${JSON.stringify(message)}`);
    if (teamId === undefined) {
      await say("I could not find your workspace ID. Please try again.");
      return;
    }
    const { user } = await iris.slack.client.users.info({
      user: message.user,
    });
    const apiKey = await getSlackApiKey(iris, teamId);
    if (apiKey === null) {
      await say(
        // eslint-disable-next-line stylistic/max-len -- Long string.
        "I could not determine how to authenticate this request. Please try again.",
      );
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
    );
    await say({
      blocks:    generateFeedbackBlocks(response),
      channel:   message.channel,
      text:      response,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      thread_ts: message.ts,
    });
  } catch (error) {
    await errorHandler(
      iris,
      {
        error:          error,
        message:        "Error in processSlackDmMessage",
        slackChannelId: message.channel,
        slackThreadTs:  message.ts,
      },
      {
        say,
      },
    );
  }
};
