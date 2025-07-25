/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { UsersInfoResponse } from "@slack/web-api";

/**
 * Gets the user's preferred name based on their Slack user info and a fallback user object.
 * Handles empty or undefined values in the user info.
 * The order of preference is:
 * 1. Display name
 * 2. Real name
 * 3. Username
 * 4. Name from the user object
 * 5. Username from the user object.
 * @param userInfo - The Slack user info response.
 * @param userObject - An object containing user information.
 * @param userObject.id - The ID of the user, guaranteed to exist.
 * @param userObject.username - The username of the user, guaranteed to exist.
 * @param userObject.name - The name of the user, if available.
 * @param userObject.team_id - The team ID of the user, if available.
 * @returns The user's preferred name as a string.
 */
export const getUserPreferredName = (
  userInfo: UsersInfoResponse,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
  userObject: { id: string; username: string; name?: string; team_id?: string },
): string => {
  if (
    userInfo.user?.profile?.display_name !== undefined
    && userInfo.user.profile.display_name !== ""
  ) {
    return userInfo.user.profile.display_name;
  }
  if (
    userInfo.user?.real_name !== undefined
    && userInfo.user.real_name !== ""
  ) {
    return userInfo.user.real_name;
  }
  if (userInfo.user?.name !== undefined && userInfo.user.name !== "") {
    return userInfo.user.name;
  }
  if (userObject.name !== undefined && userObject.name !== "") {
    return userObject.name;
  }
  return userObject.username;
};
