/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { errorHandler } from "../../utils/errorHandler.js";
import type { SlackActionCallback }
  from "../../interfaces/slackEventCallbacks.js";

/**
 * Not implemented yet.
 * @param iris - Iris's instance.
 * @param ack - The function to acknowledge the request.
 * @param body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 */
export const handleForwardFeedback: SlackActionCallback = async(
  iris,
  ack,
  body,
  respond,
) => {
  await ack();
  try {
    await respond({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
      response_type: "ephemeral",
      // eslint-disable-next-line stylistic/max-len -- Long string.
      text:          "I'm sorry, but this feature is not yet implemented. Please check back later.",
    });
  } catch (error) {
    await errorHandler(
      iris,
      {
        error:   error,
        message: "Error in handleForwardFeedback",
        slackThreadTs:
          "message" in body
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Fuck off.
            ? body.message.thread_ts as string | undefined ?? body.message.ts
            : undefined,
      },
      { respond },
    );
  }
};
