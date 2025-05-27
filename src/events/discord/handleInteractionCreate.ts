/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { processDiscordFeedback } from "../../modules/processFeedback.js";
import { errorHandler } from "../../utils/errorHandler.js";
import type { Iris } from "../../interfaces/iris.js";
import type { Interaction } from "discord.js";

/**
 * Handles the interaction payload from Discord.
 * @param iris - Iris's instance.
 * @param interaction - The interaction payload from Discord.
 */
export const handleInteractionCreate = async(
  iris: Iris,
  interaction: Interaction,
): Promise<void> => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === "feedback-positive") {
        await interaction.deferReply();
        await processDiscordFeedback(iris, interaction, "positive");
      }
      if (interaction.customId === "feedback-negative") {
        await interaction.deferReply();
        await processDiscordFeedback(iris, interaction, "negative");
      }
    }
  } catch (error) {
    const functionObject: Parameters<typeof errorHandler>[2] = {};
    if (!interaction.isAutocomplete()) {
      if (interaction.replied) {
        functionObject.editReply = interaction.editReply.bind(interaction);
      } else {
        // eslint-disable-next-line deprecation/deprecation -- Fuck you typescript, that's why.
        functionObject.interactionReply = interaction.reply.bind(interaction);
      }
    }
    await errorHandler(
      iris,
      { error: error, message: "Error in handleInteractionCreate" },
      functionObject,
    );
  }
};
