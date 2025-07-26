/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Database } from "./supabase.js";
import type { Store } from "../database/store.js";
import type { App } from "@slack/bolt";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Client } from "discord.js";

export interface Iris {
  slack:   App;
  discord: Client;
  db:      SupabaseClient<Database>;
  store:   Store;
}
