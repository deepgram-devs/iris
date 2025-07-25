/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import {
  preauthedDiscordServerIds,
  preauthedSlackWorkspaceIds,
} from "../config/preauthedCommunities.js";
import { logger } from "./logger.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Fetches the API key for a Slack workspace based on the team ID.
 * @param iris - Iris's instance.
 * @param teamId - The ID of the Slack workspace.
 * @returns The API key for the Slack workspace, or null if not found.
 */
const getSlackApiKey = async(
  iris: Iris,
  teamId: string,
): Promise<string | null> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
  return process.env.GNOSIS_TOKEN as string;
  /* eslint-disable no-unreachable -- temporarily turned off. */
  // @ts-expect-error -- temporarily turned off.
  if (preauthedSlackWorkspaceIds.includes(teamId)) {
    return process.env.GNOSIS_TOKEN ?? null;
  }
  const record = await iris.db.
    from("profiles").
    select("dg_project_id").
    eq("slack_workspace_id", teamId).
    single();
  if (record.error) {
    await logger(
      iris,
      // @ts-expect-error -- Early return breaks this.
      `Error fetching project ID for Slack workspace ${teamId}: ${record.error.message}`,
    );
    return null;
  }
  // @ts-expect-error -- Early return breaks this.
  const projectId = record.data.dg_project_id;
  return projectId;
};

/**
 * Fetches the API key for a Discord server based on the server ID.
 * @param iris - Iris's instance.
 * @param serverId - The ID of the Discord server the message is from.
 * @returns The API key for the Discord server, or null if not found.
 */
const getDiscordApiKey = async(
  iris: Iris,
  serverId: string,
): Promise<string | null> => {
  if (preauthedDiscordServerIds.includes(serverId)) {
    return process.env.GNOSIS_TOKEN ?? null;
  }
  const record = await iris.db.
    from("profiles").
    select("dg_project_id").
    eq("discord_server_id", serverId).
    single();
  if (record.error) {
    await logger(
      iris,
      `Error fetching project ID for Discord server ${serverId}: ${record.error.message}`,
    );
    return null;
  }
  const projectId = record.data.dg_project_id;
  return projectId;
};

export { getSlackApiKey, getDiscordApiKey };
