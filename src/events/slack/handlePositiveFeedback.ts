/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { processSlackFeedback } from "../../modules/processFeedback.js";
import { errorHandler } from "../../utils/errorHandler.js";
import type { SlackActionCallback }
  from "../../interfaces/slackEventCallbacks.js";

/**
 * Sends the question and answer to the feedback channel with
 * an indication that the user experience was negative.
 * @param iris - Iris's instance.
 * @param ack - The function to acknowledge the request.
 * @param body - The action payload from Slack.
 * @param respond - The function to send a message back to the user.
 * @param teamId - The ID of the Slack team (workspace).
 */
export const handlePositiveFeedback: SlackActionCallback = async(
  iris,
  ack,
  body,
  respond,
  teamId,
) => {
  await ack();
  try {
    if (!("message" in body)) {
      return;
    }
    await processSlackFeedback(iris, body, respond, "positive", teamId);
  } catch (error) {
    await errorHandler(
      iris,
      body.channel?.id === undefined
        ? {
          error:   error,
          message: "Error in handlePositiveFeedback",
          slackThreadTs:
              "message" in body
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Too lazy to typeguard.
                ? (body.message.thread_ts as string | undefined)
                  ?? body.message.ts
                : undefined,
        }
        : {
          error:          error,
          message:        "Error in handlePositiveFeedback",
          slackChannelId: body.channel.id,
          slackThreadTs:
              "message" in body
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Fuck off.
                ? (body.message.thread_ts as string | undefined)
                  ?? body.message.ts
                : undefined,
        },
      { manuallySend: true },
    );
  }
};
