/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Database } from "../interfaces/supabase.js";
import type { Installation, InstallationQuery } from "@slack/bolt";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Store class for managing Slack installations.
 */
export class Store {
  // Random comment to please the linter.
  /**
   * Constructor for the Store class.
   * @param database - The Supabase client instance.
   */
  public constructor(private readonly database: SupabaseClient<Database>) {}

  public deleteInstallation = async(
    installQuery: InstallationQuery<boolean>,
  ): Promise<void> => {
    const { error } = installQuery.isEnterpriseInstall
      ? await this.database.
        from("slack_installs").
        delete().
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- installQuery.enterpriseId is guaranteed to be defined if isEnterpriseInstall is true.
        eq("enterprise_id", installQuery.enterpriseId!)
      : await this.database.
        from("slack_installs").
        delete().
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- installQuery.teamId is guaranteed to be defined if isEnterpriseInstall is false.
        eq("team_id", installQuery.teamId!);
    if (error) {
      // eslint-disable-next-line no-console -- We cannot use our normal logger here because it requires the Iris instance.
      console.error("Failed to delete installation:", error);
    }
  };
  public fetchInstallation = async(
    installQuery: InstallationQuery<boolean>,
  ): Promise<
    Installation & {
      deepgram?: {
        projectId?: string;
      };
    }
  > => {
    const { data, error } = installQuery.isEnterpriseInstall
      ? await this.database.
        from("slack_installs").
        select("*").
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- installQuery.enterpriseId is guaranteed to be defined if isEnterpriseInstall is true.
        eq("enterprise_id", installQuery.enterpriseId!).
        single()
      : await this.database.
        from("slack_installs").
        select("*").
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- installQuery.teamId is guaranteed to be defined if isEnterpriseInstall is false.
        eq("team_id", installQuery.teamId!).
        single();
    if (error) {
      // eslint-disable-next-line no-console -- We cannot use our normal logger here because it requires the Iris instance.
      console.error("Failed to fetch installation:", error);
      return {
        appId: "",
        bot:   {
          id:     "",
          scopes: [],
          token:  "",
          userId: "",
        },
        enterprise: {
          id:   "",
          name: "",
        },
        team: {
          id:   "",
          name: "",
        },
        user: {
          id:     "",
          scopes: [],
          token:  "",
        },
      };
    }
    return {
      appId: data.app_id ?? "",
      bot:   {
        id:     data.bot_user_id ?? "",
        scopes: data.bot_scopes === null
          ? []
          : data.bot_scopes.split(","),
        token:  data.bot_token ?? "",
        userId: data.bot_user_id ?? "",
      },
      deepgram: {
        projectId: data.dg_project_id ?? "",
      },
      enterprise: {
        id:   data.enterprise_id ?? "",
        name: data.enterprise_name ?? "",
      },
      team: {
        id:   data.team_id ?? "",
        name: data.team_name ?? "",
      },
      user: {
        id:     data.user_id ?? "",
        scopes: data.user_scopes === null
          ? []
          : data.user_scopes.split(","),
        token: data.user_token ?? "",
      },
    };
  };

  public storeInstallation = async(
    installation: Installation & {
      deepgram?: {
        projectId?: string;
      };
    },
  ): Promise<void> => {
    const { error } = installation.isEnterpriseInstall === true
      ? await this.database.
        from("slack_installs").
        upsert({
        /* eslint-disable @typescript-eslint/naming-convention -- These are all supabase names */
          app_id:          installation.appId ?? null,
          bot_id:          installation.bot?.id ?? null,
          bot_scopes:      installation.bot?.scopes.join(",") ?? null,
          bot_token:       installation.bot?.token ?? null,
          bot_user_id:     installation.bot?.userId ?? null,
          dg_project_id:   installation.deepgram?.projectId ?? null,
          enterprise_id:   installation.enterprise?.id ?? null,
          enterprise_name: installation.enterprise?.name ?? null,
          team_id:         installation.team?.id ?? null,
          team_name:       installation.team?.name ?? null,
          token_type:      installation.tokenType ?? null,
          user_id:         installation.user.id,
          user_scopes:     installation.user.scopes?.join(",") ?? null,
          user_token:      installation.user.token ?? null,
        /* eslint-enable @typescript-eslint/naming-convention -- All done, turn rule back on! */
        }, {
          ignoreDuplicates: false,
          onConflict:       "enterprise_id",
        }).
        select("*").
        single()
      : await this.database.
        from("slack_installs").
        upsert({
        /* eslint-disable @typescript-eslint/naming-convention -- These are all supabase names */
          app_id:          installation.appId ?? null,
          bot_id:          installation.bot?.id ?? null,
          bot_scopes:      installation.bot?.scopes.join(",") ?? null,
          bot_token:       installation.bot?.token ?? null,
          bot_user_id:     installation.bot?.userId ?? null,
          dg_project_id:   installation.deepgram?.projectId ?? null,
          enterprise_id:   installation.enterprise?.id ?? null,
          enterprise_name: installation.enterprise?.name ?? null,
          team_id:         installation.team?.id ?? null,
          team_name:       installation.team?.name ?? null,
          token_type:      installation.tokenType ?? null,
          user_id:         installation.user.id,
          user_scopes:     installation.user.scopes?.join(",") ?? null,
          user_token:      installation.user.token ?? null,
        /* eslint-enable @typescript-eslint/naming-convention -- All done, turn rule back on! */
        }, {
          ignoreDuplicates: false,
          onConflict:       "team_id",
        }).
        select("*").
        single();
    if (error) {
      // eslint-disable-next-line no-console -- We cannot use our normal logger here because it requires the Iris instance.
      console.error("Failed to store installation:", error);
    }
  };
}
