/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

/**
 * Server IDs that are permitted to use our dedicated Gnosis key,
 * rather than a deepgram API key.
 */
const preauthedDiscordServerIds: Array<string> = [];

/**
 * Workspace IDs that are permitted to use our dedicated Gnosis key,
 * rather than a deepgram API key.
 */
const preauthedSlackWorkspaceIds: Array<string> = [];

export { preauthedDiscordServerIds, preauthedSlackWorkspaceIds };
