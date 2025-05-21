/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
import { fetchSlackThreadMessages } from "../../utils/fetchThreadMessages.js";
import { makeAiRequestOnSlack } from "../../utils/makeAiRequest.js";
import {
  trimSlackMessageFromElement,
  trimSlackMessageFromEvent,
} from "../../utils/trimSlackMessage.js";
import { generateFeedbackBlocks } from "../blocks/generateFeedbackBlocks.js";
import type { Iris } from "../../interfaces/iris.js";
import type { SayFn } from "@slack/bolt";
import type {
  FileShareMessageEvent,
  GenericMessageEvent,
} from "@slack/web-api";

/**
 * Responds to a Slack thread message that mentions Iris.
 * @param iris - Iris's instance.
 * @param message - The message payload from Slack.
 * @param say - The function to send a message back to the user.
 */
export const processSlackThreadMessage = async(
  iris: Iris,
  message: (GenericMessageEvent | FileShareMessageEvent) & {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    thread_ts: string;
  },
  say: SayFn,
): Promise<void> => {
  try {
    const { user } = await iris.slack.client.users.info({
      user: message.user,
    });
    const username
      = user?.profile?.display_name ?? user?.real_name ?? "Unknown User";
    const { channel } = await iris.slack.client.conversations.info({
      channel: message.channel,
    });
    const channelName = channel?.name ?? "Unknown Public Thread";
    const previousReplies = await fetchSlackThreadMessages(
      iris,
      message.channel,
      message.thread_ts,
    );
    const previousMessages = previousReplies.filter((messageToMap) => {
      return messageToMap.ts !== message.ts;
    });
    const parsedPreviousMessages = previousMessages.map((messageToMap) => {
      return trimSlackMessageFromElement(messageToMap);
    });
    parsedPreviousMessages.sort((a, b) => {
      const aTs = Number.parseFloat(a.ts ?? "0");
      const bTs = Number.parseFloat(b.ts ?? "0");
      return aTs - bTs;
    });
    const response = await makeAiRequestOnSlack(
      iris,
      [ ...parsedPreviousMessages, trimSlackMessageFromEvent(message) ],
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
        message:        "Error in processSlackThreadMessage",
        slackChannelId: message.channel,
        slackThreadTs:  message.ts,
      },
      {
        say,
      },
    );
  }
};
