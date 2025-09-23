/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import {
  MessageFlags,
  type AutocompleteInteraction,
  type Interaction,
  type Message,
} from "discord.js";
// eslint-disable-next-line @typescript-eslint/naming-convention -- Importing a class.
import ShortUniqueId from "short-unique-id";
import { getWorkspaceBotToken } from "./getWorkspaceBotToken.js";
import { logger } from "./logger.js";
import type { Iris } from "../interfaces/iris.js";
import type {
  RespondArguments,
  RespondFn,
  SayArguments,
  SayFn,
} from "@slack/bolt";

/**
 * Utility to handle errors. Expects a couple of objects, the first being metadata for the error,
 * and the second being possible functions to respond to the user.
 * Logs the error to our logging channels.
 * @param iris - Iris's instance.
 * @param data - Metadata.
 * @param data.enterpriseId - The ID of the Slack enterprise (if applicable).
 * @param data.error - The error object.
 * @param data.message - A description of where the error occurred.
 * @param data.slackChannelId - The Slack channel ID to respond in.
 * @param data.slackThreadTs - The Slack thread timestamp to respond in.
 * @param data.teamId - The ID of the Slack team (workspace) the error occurred in.
 * @param functions - Functions to respond to the user.
 * @param functions.respond - Slack's respond function.
 * @param functions.say - Slack's say function.
 * @param functions.msgReply - The reply method of a Discord message object.
 * @param functions.interactionReply - The reply method of a Discord interaction object.
 * @param functions.editReply - The edit reply method of a Discord interaction object.
 * @param functions.manuallySend - Whether to manually send a message to the Slack channel.
 */
export const errorHandler = async(
  iris: Iris,
  data: {
    error:           unknown;
    message:         string;
    slackChannelId?: string;
    slackThreadTs?:  string | undefined;
    teamId?:         string | undefined;
    enterpriseId?:   string | undefined;
  },
  functions: {
    manuallySend?:     boolean;
    respond?:          RespondFn;
    say?:              SayFn;
    msgReply?:         Message["reply"];
    interactionReply?: Exclude<Interaction, AutocompleteInteraction>["reply"];
    editReply?:
    Exclude<Interaction, AutocompleteInteraction>["editReply"];
  },
): Promise<void> => {
  const id = new ShortUniqueId({ length: 16 }).rnd();
  await logger(iris, `Error ID: ${id}`, true);
  await logger(iris, data.message, true);
  if (data.error instanceof Error) {
    await logger(iris, `Error message: ${data.error.message}`, true);
    await logger(iris, `Error stack: ${data.error.stack ?? "No stack trace"}`, true);
  }
  if (functions.manuallySend === true) {
    const botToken = data.teamId === undefined
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
      ? process.env.SLACK_BOT_TOKEN as string
      : await getWorkspaceBotToken(iris, data.teamId, data.enterpriseId);

    await iris.slack.client.chat.postMessage({
      channel: data.slackChannelId ?? "general",
      text:    `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
      token:   botToken,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      ...data.slackThreadTs !== undefined && { thread_ts: data.slackThreadTs },
    });
  }
  if (functions.respond) {
    const botToken = data.teamId === undefined
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
      ? process.env.SLACK_BOT_TOKEN as string
      : await getWorkspaceBotToken(iris, data.teamId, data.enterpriseId);

    const responseArguments: RespondArguments = {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      replace_original: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      response_type:    "ephemeral",
      text:             `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
      token:            botToken,
    };
    if (data.slackThreadTs !== undefined) {
      responseArguments.thread_ts = data.slackThreadTs;
    }
    await functions.respond(responseArguments);
    return;
  }
  if (functions.say) {
    const botToken = data.teamId === undefined
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
      ? process.env.SLACK_BOT_TOKEN as string
      : await getWorkspaceBotToken(iris, data.teamId, data.enterpriseId);
    const sayArguments: SayArguments = {
      text:  `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
      token: botToken,
    };
    if (data.slackChannelId !== undefined) {
      sayArguments.channel = data.slackChannelId;
    }
    if (data.slackThreadTs !== undefined) {
      sayArguments.thread_ts = data.slackThreadTs;
    }
    await functions.say(sayArguments);
  }
  if (functions.msgReply) {
    await functions.msgReply({
      content: `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
    });
  }
  if (functions.interactionReply) {
    await functions.interactionReply({
      content: `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
      flags:   [ MessageFlags.Ephemeral ],
    });
  }
  if (functions.editReply) {
    await functions.editReply({
      content: `⚠️ Whoops! Something went wrong! Please notify Naomi and share this Error ID: ${id}`,
    });
  }
};
