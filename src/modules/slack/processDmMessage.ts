/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
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
 */
export const processSlackDmMessage = async(
  iris: Iris,
  message: GenericMessageEvent | FileShareMessageEvent,
  say: SayFn,
): Promise<void> => {
  try {
    const { user } = await iris.slack.client.users.info({
      user: message.user,
    });
    const username
      = user?.profile?.display_name ?? user?.real_name ?? "Unknown User";
    const channelName = "Direct Messages";
    const response = await makeAiRequestOnSlack(
      iris,
      [ trimSlackMessageFromEvent(message) ],
      channelName,
      username,
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
