/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Iris } from "../interfaces/iris.js";
import { handleForwardFeedback } from "./slack/handleForwardFeedback.js";
import { handleSlackMessage } from "./slack/handleMessage.js";
import { handleNegativeFeedback } from "./slack/handleNegativeFeedback.js";
import { handlePositiveFeedback } from "./slack/handlePositiveFeedback.js";

/**
 * Mounts the callback functions to the Slack events.
 * @param iris - Iris's instance.
 */
export const mountSlackEvents = (iris: Iris) => {
    iris.slack.action("feedback-positive", async ({ack, body, respond}) => {
        await handlePositiveFeedback(iris, ack, body, respond);
    });
    iris.slack.action("feedback-negative",  async ({ack, body, respond}) => {
        handleNegativeFeedback(iris, ack, body, respond);
    });
    iris.slack.action("forward-feedback",  async ({ack, body, respond}) => {
        handleForwardFeedback(iris, ack, body, respond);
        });
    iris.slack.message(async ({message, say}) => {
        handleSlackMessage(iris, message, say);
    });
};
