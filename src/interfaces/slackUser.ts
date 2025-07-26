/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
/* eslint-disable @typescript-eslint/naming-convention -- It's what Slack sends. */

export interface SlackUser {
  ok:           boolean;
  access_token: string;
  token_type:   string;
  scope:        string;
  bot_user_id:  string;
  app_id:       string;
  team?: {
    name: string;
    id:   string;
  };
  enterprise?: {
    name: string;
    id:   string;
  };
  authed_user?: {
    id:           string;
    scope:        string;
    access_token: string;
    token_type:   string;
  };
  deepgram?: {
    project_id:         string;
    api_key:            string;
    api_key_expiration: string;
  };
}
