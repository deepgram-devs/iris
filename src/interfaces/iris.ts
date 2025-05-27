/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { App } from "@slack/bolt";
import type { Client } from "discord.js";

export interface Iris {
  slack:   App;
  discord: Client;
}
