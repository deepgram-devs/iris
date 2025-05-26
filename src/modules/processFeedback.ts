/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { logger } from "../utils/logger.js";
import type { Iris } from "../interfaces/iris.js";
import type { RespondFn, BlockAction } from "@slack/bolt";

/**
 * Grabs the question and answer that are associated with user
 * feedback and sends them to the feedback channel.
 * @param iris - Iris's instance.
 * @param body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 * @param feedbackType - Whether the feedback is "positive" or "negative".
 */
export const processFeedback = async(
  iris: Iris,
  body: BlockAction,
  respond: RespondFn,
  feedbackType: "positive" | "negative",
): Promise<void> => {
  const { message, channel, user: userObject } = body;
  await logger(
    iris,
    `Processing feedback from ${userObject.username} in channel: ${
      channel?.id ?? "no channel id"
    } - ${channel?.name ?? "no channel name"} with message TS ${
      String(message?.thread_ts ?? `${message?.ts ?? "what no ts"} but not in thread`)
    } - sending to ${process.env.FEEDBACK_CHANNEL ?? "no feedback channel"}`,
  );
  if (!message) {
    await respond({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      replace_original: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      response_type:    "ephemeral",
      text:             "No message found in the feedback payload.",
    });
    return;
  }
  const userInfo = await iris.slack.client.users.info({
    user: userObject.id,
  });
  const user
    = userInfo.user?.profile?.display_name
    ?? userInfo.user?.real_name
    ?? userInfo.user?.name
    ?? userObject.username;
  const channelId = process.env.FEEDBACK_CHANNEL;
  if (channelId === undefined) {
    await respond({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      replace_original: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      response_type:    "ephemeral",
      text:             "Feedback channel not set in environment variables.",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      thread_ts:
        typeof message.thread_ts === "string"
          ? message.thread_ts
          : message.ts,
    });
    return;
  }
  const previousMessageRequest = await iris.slack.client.conversations.replies({
    channel: channel
      ? channel.id
      : "Unknown",
    inclusive: false,
    latest:    message.ts,
    limit:     1,
    ts:        typeof message.thread_ts === "string"
      ? message.thread_ts
      : message.ts,
  });
  const previousMessage = previousMessageRequest.messages?.reverse()[0];
  const blocks = [
    {
      text: {
        text: `${
          feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)
        } Feedback`,
        type: "plain_text",
      },
      type: "header",
    },
    {
      elements: [
        {
          text: `Feedback from ${user}:`,
          type: "mrkdwn",
        },
      ],
      type: "context",
    },
    {
      text: {
        text: `Question: ${previousMessage?.text ?? "Unknown"}`,
        type: "mrkdwn",
      },
      type: "section",
    },
    {
      text: {
        text: `Response: ${message.text ?? "Unknown"}`,
        type: "mrkdwn",
      },
      type: "section",
    },
  ];
  await iris.slack.client.chat.postMessage({
    blocks:  blocks,
    channel: channelId,
    text:    "Feedback received!",
  });
  await respond({
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    replace_original: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    response_type:    "ephemeral",
    text:             `Thank you for your feedback, ${user}! You selected: ${feedbackType}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    thread_ts:
      typeof message.thread_ts === "string"
        ? message.thread_ts
        : message.ts,
  });
};
