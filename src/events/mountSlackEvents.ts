/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { handleForwardFeedback } from "./slack/handleForwardFeedback.js";
import { handleSlackMessage } from "./slack/handleMessage.js";
import { handleNegativeFeedback } from "./slack/handleNegativeFeedback.js";
import { handlePositiveFeedback } from "./slack/handlePositiveFeedback.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Mounts the callback functions to the Slack events.
 * @param iris - Iris's instance.
 */
export const mountSlackEvents = (iris: Iris): void => {
  iris.slack.action("feedback-positive", async({ ack, body, respond }) => {
    await handlePositiveFeedback(iris, ack, body, respond);
  });
  iris.slack.action("feedback-negative", async({ ack, body, respond }) => {
    await handleNegativeFeedback(iris, ack, body, respond);
  });
  iris.slack.action("forward-feedback", async({ ack, body, respond }) => {
    await handleForwardFeedback(iris, ack, body, respond);
  });
  iris.slack.message(async({ message, say, context }) => {
    // The workspace (team) id is available as `team`
    const { teamId } = context;
    await handleSlackMessage(iris, message, say, teamId);
  });
};
