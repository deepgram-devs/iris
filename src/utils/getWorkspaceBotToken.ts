/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import { logger } from "./logger.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Fetches the bot token for a Slack workspace based on the team ID.
 * @param iris - Iris's instance.
 * @param teamId - The ID of the Slack workspace.
 * @param enterpriseId - The ID of the Slack enterprise, if applicable.
 * @returns The bot token for the Slack workspace, or null if not found.
 */
const getWorkspaceBotToken = async(
  iris: Iris,
  teamId: string | undefined,
  enterpriseId: string | undefined,
): Promise<string> => {
  const installation = await iris.store.fetchInstallation({
    enterpriseId:        enterpriseId,
    isEnterpriseInstall: enterpriseId !== undefined,
    teamId:              teamId,
  });
  if (installation.bot === undefined) {
    await logger(
      iris,
      `No bot found for team ID ${teamId ?? enterpriseId ?? "UNKNOWN WORKSPACE"}. Returning default token.`,
    );
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
    return process.env.SLACK_BOT_TOKEN as string;
  }
  if (installation.bot.token === "") {
    await logger(
      iris,
      `Bot token for team ID ${teamId ?? enterpriseId ?? "UNKNOWN WORKSPACE"} is empty. Returning default token.`,
    );
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
    return process.env.SLACK_BOT_TOKEN as string;
  }
  return installation.bot.token;
};

export { getWorkspaceBotToken };
