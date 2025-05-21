/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { SlackActionCallback } from "../../interfaces/slackEventCallbacks.js";
import { processFeedback } from "../../modules/processFeedback.js";

/**
 * @param iris - Iris's instance.
 * @param ack - The function to acknowledge the request.
 * @param body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 */
export const handleNegativeFeedback: SlackActionCallback = async(iris, ack, body, respond) => {
    await ack();
    if (!("message" in body)) {
        return;
    }
    await processFeedback(iris, body, respond, "negative"); 
};
