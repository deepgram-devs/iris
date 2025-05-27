/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  type MessageCreateOptions,
} from "discord.js";

/**
 * Attaches the feedback instructions and buttons to the content
 * for a Discord message.
 * @param message - The string to use in the message.
 * @returns A Discord message object with the feedback buttons attached.
 */
export const appendFeedbackButtons = (
  message: string,
): MessageCreateOptions => {
  const positiveButton = new ButtonBuilder().
    setCustomId("feedback-positive").
    setLabel("👍🏻");
  const negativeButton = new ButtonBuilder().
    setCustomId("feedback-negative").
    setLabel("👎🏻");
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    positiveButton,
    negativeButton,
  );
  return {
    components: [ row ],
    content:    `${message}\n-# Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.`,
  };
};
