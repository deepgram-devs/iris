/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { Events } from "discord.js";
import { logger } from "../utils/logger.js";
import { handleInteractionCreate } from "./discord/handleInteractionCreate.js";
import { handleMessageCreate } from "./discord/handleMessageCreate.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Mounts the callback functions to the Discord events.
 * @param iris - Iris's instance.
 */
export const mountDiscordEvents = (iris: Iris): void => {
  iris.discord.on(Events.ClientReady, () => {
    void logger(iris, "⚡️ Discord bot is ready");
  });

  iris.discord.on(Events.MessageCreate, (message) => {
    void handleMessageCreate(iris, message);
  });

  iris.discord.on(Events.InteractionCreate, (interaction) => {
    void handleInteractionCreate(iris, interaction);
  });
};
