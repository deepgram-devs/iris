/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { SlackActionCallback } from "../../interfaces/slackEventCallbacks.js";

/**
 * Not implemented yet.
 * @param _iris - Iris's instance.
 * @param ack - The function to acknowledge the request.
 * @param _body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 */
export const handleForwardFeedback: SlackActionCallback = async(
  _iris,
  ack,
  _body,
  respond,
) => {
  await ack();
  await respond({
    // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
    response_type: "ephemeral",
    text:
      "I'm sorry, but this feature is not yet implemented. Please check back later.",
  });
};
