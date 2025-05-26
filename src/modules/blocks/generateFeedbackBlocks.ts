/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { KnownBlock } from "@slack/web-api";

/**
 * Constructs the blocks for the feedback section of a Slack message.
 * @param content - The content to be displayed in the feedback block.
 * @returns An array of blocks to be used in a Slack message.
 */
export const generateFeedbackBlocks = (content: string): Array<KnownBlock> => {
  return [
    {
      text: {
        text: content,
        type: "mrkdwn",
      },
      type: "section",
    },
    {
      elements: [
        {
          // eslint-disable-next-line stylistic/max-len -- Long boi string.
          text: "Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.",
          type: "mrkdwn",
        },
      ],
      type: "context",
    },
    {
      elements: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
          action_id: "feedback-positive",
          style:     "primary",
          text:      { emoji: true, text: "👍🏻", type: "plain_text" },
          type:      "button",
          value:     "feedback-positive",
        },
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
          action_id: "feedback-negative",
          style:     "danger",
          text:      { emoji: true, text: "👎🏻", type: "plain_text" },
          type:      "button",
          value:     "feedback-negative",
        },
      ],
      type: "actions",
    },
  ];
};
