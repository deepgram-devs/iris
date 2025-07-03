/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../interfaces/supabase.js";

/**
 * Creates a Supabase client instance using environment variables. This
 * allows the bot to use the same authenticated instance across all logic.
 * @returns A promise that resolves to the
 * Supabase client.
 */
export const getSupabase = async(): Promise<SupabaseClient<Database>> => {
  const supabaseReference = process.env.SUPABASE_REFERENCE_ID;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabaseDevrelId = process.env.SUPABASE_DEVREL_USERID;

  if (
    supabaseReference === undefined
    || supabaseServiceKey === undefined
    || supabaseDevrelId === undefined
  ) {
    throw new Error(`Missing supabase variables:
SUPABASE_REFERENCE_ID: ${process.env.SUPABASE_REFERENCE_ID ?? "undefined"}
SUPABASE_SERVICE_KEY: ${supabaseServiceKey ?? "undefined"}
SUPABASE_DEVREL_USERID: ${supabaseDevrelId ?? "undefined"}`);
  }

  const supabaseUrl = `https://${supabaseReference}.supabase.co`;

  const client = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  });

  await client.auth.admin.getUserById(supabaseDevrelId);

  return client;
};
