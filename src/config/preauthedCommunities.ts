/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

/**
 * Our dedicated Slack workspace that does not require a Slack token.
 */
const homeSlackWorkspaceId = "T0LL805A9";

/**
 * Server IDs that are permitted to use our dedicated Gnosis key,
 * rather than a deepgram API key.
 */
const preauthedDiscordServerIds: Array<string> = [];

/**
 * Workspace IDs that are permitted to use our dedicated Gnosis key,
 * rather than a deepgram API key.
 */
const preauthedSlackWorkspaceIds: Array<string> = [ homeSlackWorkspaceId ];

export {
  preauthedDiscordServerIds,
  preauthedSlackWorkspaceIds,
  homeSlackWorkspaceId,
};
