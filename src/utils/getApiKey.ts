/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import {
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
const getSlackAuthHeaders = async(
  iris: Iris,
  teamId: string | undefined,
  enterpriseId: string | undefined,
): Promise<Headers> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  try {
    const installation = await iris.store.fetchInstallation({
      enterpriseId:        enterpriseId,
      isEnterpriseInstall: Boolean(enterpriseId),
      teamId:              teamId ?? "",
    });

    if (
      preauthedSlackWorkspaceIds.includes(teamId ?? enterpriseId ?? "oopsie")
    ) {
      headers.set(
        "Authorization",
        `token ${process.env.DEEPGRAM_API_KEY ?? "oh no"}`,
      );
      await logger(
        iris,
        `Using pre-authenticated Deepgram API key for workspace: ${
          teamId ?? enterpriseId ?? "unknown"
        }`,
      );
      return headers;
    }

    const deepgramApiKey: string | null = installation.deepgram?.apiKey ?? null;

    // First, check if we have OAuth data with Deepgram API key.
    if (deepgramApiKey !== null) {
      await logger(
        iris,
        `Using Deepgram API key from OAuth integration - Workspace: ${
          teamId ?? enterpriseId ?? "unknown"
        }`,
      );
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

    if (process.env.DEEPGRAM_API_KEY !== undefined) {
      await logger(
        iris,
        `Using fallback DEEPGRAM_API_KEY from environment - Workspace: ${
          teamId ?? enterpriseId ?? "unknown"
        }`,
      );
      headers.set("Authorization", `token ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }

    // If no auth method is available, throw error
    throw new Error("No authentication method available for Gnosis API");
  } catch (error) {
    await logger(
      iris,
      `Error getting auth headers for workspace ${
        teamId ?? enterpriseId ?? "unknown"
      }: ${String(error)}`,
    );
    // Return headers with fallback if available
    if (process.env.DEEPGRAM_API_KEY !== undefined) {
      headers.set("Authorization", `token ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }
    throw error;
  }
};

/**
 * Fetches the authentication headers for Gnosis API for Discord servers.
 * @param iris - Iris's instance.
 * @param serverId - The ID of the Discord server the bot is operating in.
 * @returns The authentication headers for Gnosis API.
 */
const getDiscordAuthHeaders = async(
  iris: Iris,
  serverId: string,
): Promise<Headers> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  /*
   * TODO: Once Discord installations are stored with Deepgram data,
   * we'll fetch the installation and check for deepgram?.api_key
   * For now, we'll add a placeholder
   */
  try {
    // This will be installation.deepgram?.api_key.
    const deepgramApiKey: string | null = null;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This will be resolved when we finalise the flow.
    if (deepgramApiKey !== null) {
      await logger(
        iris,
        "Using Deepgram API key from Discord OAuth integration",
      );
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- This will not be type never when we finish implementation.
      headers.set("Authorization", `Bearer ${deepgramApiKey}`);
      return headers;
    }

    // Fallback to environment variable
    if (process.env.DEEPGRAM_API_KEY !== undefined) {
      await logger(
        iris,
        "Using fallback DEEPGRAM_API_KEY from environment for Discord",
      );
      headers.set("Authorization", `Bearer ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }

    // If no auth method is available, throw error
    throw new Error("No authentication method available for Gnosis API");
  } catch (error) {
    await logger(
      iris,
      `Error getting auth headers for Discord server ${serverId}: ${String(
        error,
      )}`,
    );
    // Return headers with fallback if available
    if (process.env.DEEPGRAM_API_KEY !== undefined) {
      headers.set("Authorization", `Bearer ${process.env.DEEPGRAM_API_KEY}`);
      return headers;
    }
    throw error;
  }
};

export { getSlackAuthHeaders, getDiscordAuthHeaders };
