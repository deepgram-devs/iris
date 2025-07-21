/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
import { fetchSlackThreadMessages } from "../../utils/fetchThreadMessages.js";
import { getSlackApiKey } from "../../utils/getApiKey.js";
import { getWorkspaceBotToken } from "../../utils/getWorkspaceBotToken.js";
import { logger } from "../../utils/logger.js";
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
 * @param teamId - The ID of the Slack team (workspace) the message is from.
 */
// eslint-disable-next-line max-statements -- This function is long, but it handles multiple cases.
export const processSlackThreadMessage = async(
  iris: Iris,
  message: (GenericMessageEvent | FileShareMessageEvent) & {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    thread_ts: string;
  },
  say: SayFn,
  teamId?: string,
): Promise<void> => {
  try {
    await logger(
      iris,
      `Processing Slack Thread Mention: ${JSON.stringify(message)}`,
    );
    if (teamId === undefined) {
      await say("I could not find your workspace ID. Please try again.");
      return;
    }
    const botToken = await getWorkspaceBotToken(iris, teamId);
    const { user } = await iris.slack.client.users.info({
      token: botToken,
      user:  message.user,
    });
    const apiKey = await getSlackApiKey(iris, teamId);
    if (apiKey === null) {
      await say({
        // eslint-disable-next-line stylistic/max-len -- Long string.
        text:  "I could not determine how to authenticate this request. Please try again.",
        token: botToken,
      });
      return;
    }
    const username
      = user?.profile?.display_name ?? user?.real_name ?? "Unknown User";
    const { channel } = await iris.slack.client.conversations.info({
      channel: message.channel,
      token:   botToken,
    });
    const channelName = channel?.name ?? "Unknown Public Thread";
    const previousReplies = await fetchSlackThreadMessages(
      iris,
      message.channel,
      message.thread_ts,
      botToken,
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
      apiKey,
      botToken,
    );
    await say({
      blocks:    generateFeedbackBlocks(response),
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
        message:        "Error in processSlackThreadMessage",
        slackChannelId: message.channel,
        slackThreadTs:  message.ts,
        teamId:         teamId,
      },
      {
        say,
      },
    );
  }
};
