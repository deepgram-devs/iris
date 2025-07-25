/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { getUserPreferredName } from "../utils/getUserPreferredName.js";
import { getWorkspaceBotToken } from "../utils/getWorkspaceBotToken.js";
import { logger } from "../utils/logger.js";
import type { Iris } from "../interfaces/iris.js";
import type { RespondFn, BlockAction } from "@slack/bolt";
import type { ButtonInteraction } from "discord.js";

/**
 * Grabs the question and answer that are associated with user
 * feedback and sends them to the feedback channel.
 * @param iris - Iris's instance.
 * @param body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 * @param feedbackType - Whether the feedback is "positive" or "negative".
 * @param teamId - The ID of the Slack team (workspace).
 */
const processSlackFeedback = async(
  iris: Iris,
  body: BlockAction,
  respond: RespondFn,
  feedbackType: "positive" | "negative",
  teamId?: string,
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
  if (teamId === undefined) {
    // We have to use `respond` here because we cannot find a token without a team ID.
    await respond({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      replace_original: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      response_type:    "ephemeral",
      text:             "I could not find your workspace ID. Please try again.",
    });
    return;
  }
  const botToken = await getWorkspaceBotToken(iris, teamId);
  if (!message) {
    await iris.slack.client.chat.postEphemeral({
      channel: channel?.id ?? "Unknown",
      text:    "No message found in the feedback payload.",
      token:   botToken,
      user:    userObject.id,
    });
    return;
  }
  const threadTs
        = typeof message.thread_ts === "string"
          ? message.thread_ts
          : message.ts;
  const userInfo = await iris.slack.client.users.info({
    token: botToken,
    user:  userObject.id,
  });
  const userName = getUserPreferredName(userInfo, userObject);
  const channelId = process.env.FEEDBACK_CHANNEL;
  if (channelId === undefined) {
    await iris.slack.client.chat.postEphemeral({
      channel:   channel?.id ?? "Unknown",
      text:      "Feedback channel not set in environment variables.",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      thread_ts: threadTs,
      token:     botToken,
      user:      userObject.id,
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
    token:     botToken,
    ts:        threadTs,
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
          text: `Feedback from ${userName}:`,
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
  await iris.slack.client.chat.postEphemeral({
    channel:   channel?.id ?? "Unknown",
    text:      `Thank you for your feedback, ${userName}! You selected: ${feedbackType}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    thread_ts: threadTs,
    token:     botToken,
    user:      userObject.id,
  });
};

/**
 * Grabs the question and answer that are associated with user
 * feedback and sends them to the feedback channel.
 * @param iris - Iris's instance.
 * @param interaction - The Discord button interaction.
 * @param feedbackType - Whether the feedback is "positive" or "negative".
 */
const processDiscordFeedback = async(
  iris: Iris,
  interaction: ButtonInteraction,
  feedbackType: "positive" | "negative",
): Promise<void> => {
  const { message, user, channel } = interaction;
  await logger(
    iris,
    `Processing Discord feedback from ${user.username} with message ID: ${message.id}`,
  );
  const slackChannelId = process.env.FEEDBACK_CHANNEL;
  if (slackChannelId === undefined) {
    await interaction.editReply({
      content: "Feedback channel not set in environment variables.",
    });
    return;
  }
  const previousMessages = await channel?.messages.fetch({
    before: message.id,
    limit:  1,
  });
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
          text: `Feedback from ${user.displayName}:`,
          type: "mrkdwn",
        },
      ],
      type: "context",
    },
    {
      text: {
        text: `Question: ${previousMessages?.first()?.content ?? "Unknown"}`,
        type: "mrkdwn",
      },
      type: "section",
    },
    {
      text: {
        text: `Response: ${message.content}`,
        type: "mrkdwn",
      },
      type: "section",
    },
  ];
  await iris.slack.client.chat.postMessage({
    blocks:  blocks,
    channel: slackChannelId,
    text:    "Feedback received!",
  });
  await interaction.editReply({
    content: `Thank you for your feedback, ${user.username}! You selected: ${feedbackType}`,
  });
};

export { processSlackFeedback, processDiscordFeedback };
