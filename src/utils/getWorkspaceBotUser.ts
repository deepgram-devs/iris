/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import type { Installation } from "@slack/bolt";

/**
 * Gets the bot user ID for a Slack workspace based on the installation.
 * If the installation does not have a bot user, it falls back to the environment variable.
 * @param installation - The installation object containing bot information.
 * @returns The bot user ID for the Slack workspace.
 * @throws Will throw an error if no bot user ID is found in the environment variables.
 */
export const getWorkspaceBotUser = (installation: Installation): string => {
  if (installation.bot === undefined || installation.bot.userId === "") {
    if (
      process.env.BOT_USER_ID === undefined
      || process.env.BOT_USER_ID === ""
    ) {
      throw new Error("No bot user ID found in environment variables.");
    }
    return process.env.BOT_USER_ID;
  }
  return installation.bot.userId;
};
