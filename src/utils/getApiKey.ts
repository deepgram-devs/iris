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
 * Fetches the authentication headers for Gnosis API based on available credentials.
 * @param iris - Iris's instance.
 * @param teamId - The ID of the Slack workspace.
 * @param enterpriseId - The ID of the Slack enterprise (if applicable).
 * @returns The authentication headers for Gnosis API.
 */
const getSlackAuthHeaders = async (
  iris: Iris,
  teamId: string | undefined,
  enterpriseId: string | undefined,
): Promise<Headers> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  try {
    // First, check if we have OAuth data with Deepgram API key
    const installation = await iris.store.fetchInstallation({
      enterpriseId: enterpriseId,
      isEnterpriseInstall: Boolean(enterpriseId),
      teamId: teamId ?? "",
    });

    /*
     * TODO: Once the database schema is updated and the Store class returns Deepgram data,
     * check for installation.deepgram?.api_key here
     * For now, we'll add a placeholder
     */
    /**
     * This will be installation.deepgram?.api_key.
     */
    const deepgramApiKey: string | null = null;

    if (deepgramApiKey !== null) {
      await logger(iris, "Using Deepgram API key from OAuth integration");
      headers.set("Authorization", `token ${deepgramApiKey}`);
      return headers;
    }

    /*
     * Strategy 2: Client auth for upgraded partners (future implementation)
     * TODO: Check for client credentials when they're added to SlackUser interface
     * if (installation.gnosis_client_id && installation.gnosis_client_secret) {
     *   headers.set("X-Gnosis-Client-ID", installation.gnosis_client_id);
     *   headers.set("X-Gnosis-Client-Secret", installation.gnosis_client_secret);
     *   return headers;
     * }
     */

    // Strategy 3: Fallback to environment variable
    if (process.env.DEEPGRAM_API_KEY) {
      await logger(iris, "Using fallback DEEPGRAM_API_KEY from environment");
      headers.set("Authorization", `token ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }

    // If no auth method is available, throw error
    throw new Error("No authentication method available for Gnosis API");
  } catch (error) {
    await logger(
      iris,
      `Error getting auth headers for workspace ${teamId ?? enterpriseId ?? "unknown"}: ${String(error)}`,
    );
    // Return headers with fallback if available
    if (process.env.DEEPGRAM_API_KEY) {
      headers.set("Authorization", `token ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }
    throw error;
  }
};

/**
 * Fetches the authentication headers for Gnosis API for Discord servers.
 * @param iris - Iris's instance.
 * @param serverId - The ID of the Discord server.
 * @returns The authentication headers for Gnosis API.
 */
const getDiscordAuthHeaders = async (
  iris: Iris,
  serverId: string,
): Promise<Headers> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  try {

    /*
     * TODO: Once Discord installations are stored with Deepgram data,
     * we'll fetch the installation and check for deepgram?.api_key
     * For now, we'll add a placeholder
     */
    /**
     * This will be installation.deepgram?.api_key.
     */
    const deepgramApiKey: string | null = null;

    if (deepgramApiKey !== null) {
      await logger(iris, "Using Deepgram API key from Discord OAuth integration");
      headers.set("Authorization", `Bearer ${deepgramApiKey}`);
      return headers;
    }

    // Fallback to environment variable
    if (process.env.DEEPGRAM_API_KEY) {
      await logger(iris, "Using fallback DEEPGRAM_API_KEY from environment for Discord");
      headers.set("Authorization", `Bearer ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }

    // If no auth method is available, throw error
    throw new Error("No authentication method available for Gnosis API");
  } catch (error) {
    await logger(
      iris,
      `Error getting auth headers for Discord server ${serverId}: ${String(error)}`,
    );
    // Return headers with fallback if available
    if (process.env.DEEPGRAM_API_KEY) {
      headers.set("Authorization", `Bearer ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }
    throw error;
  }
};

/**
 * Fetches the API key for a Slack workspace based on the team ID.
 * @param iris - Iris's instance.
 * @param teamId - The ID of the Slack workspace.
 * @param enterpriseId - The ID of the Slack enterprise (if applicable).
 * @returns The API key for the Slack workspace, or null if not found.
 */
const getSlackApiKey = async (
  iris: Iris,
  teamId: string | undefined,
  enterpriseId: string | undefined,
): Promise<string | null> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know this exists, we would never get here otherwise.
  return process.env.GNOSIS_TOKEN as string;
  /* eslint-disable no-unreachable -- temporarily turned off. */
  // @ts-expect-error -- temporarily turned off.
  if (
    // @ts-expect-error -- temporarily turned off.
    preauthedSlackWorkspaceIds.includes(teamId)
    // @ts-expect-error -- temporarily turned off.
    || preauthedSlackWorkspaceIds.includes(enterpriseId)
  ) {
    return process.env.GNOSIS_TOKEN ?? null;
  }
  const record = await iris.db.
    from("profiles").
    select("dg_project_id").
    // @ts-expect-error -- temporarily turned off.
    eq("slack_workspace_id", teamId).
    single();
  if (record.error) {
    await logger(
      iris,
      // @ts-expect-error -- Early return breaks this.
      `Error fetching project ID for Slack workspace ${teamId ?? enterpriseId ?? "unknown workspace"}: ${record.error.message}`,
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
const getDiscordApiKey = async (
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

export { getSlackApiKey, getDiscordApiKey, getSlackAuthHeaders, getDiscordAuthHeaders };
