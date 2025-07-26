/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import slackBolt, {
  type InstallationQuery,
} from "@slack/bolt";
import { Client, GatewayIntentBits } from "discord.js";
import { Store } from "./database/store.js";
import { getSupabase } from "./database/supabase.js";
import { mountDiscordEvents } from "./events/mountDiscordEvents.js";
import { mountSlackEvents } from "./events/mountSlackEvents.js";
import { logger } from "./utils/logger.js";
import type { Iris } from "./interfaces/iris.js";
import type { SlackUser } from "./interfaces/slackUser.js";

if (
  process.env.SLACK_SIGNING_SECRET === undefined
  || process.env.SLACK_BOT_TOKEN === undefined
  || process.env.DISCORD_BOT_TOKEN === undefined
) {
  throw new Error(
    // eslint-disable-next-line stylistic/max-len -- Long string.
    "SLACK_SIGNING_SECRET and SLACK_BOT_TOKEN and DISCORD_BOT_TOKEN must be set in the environment variables.",
  );
}
// eslint-disable-next-line @typescript-eslint/naming-convention -- It's a class.
const { App } = slackBolt;
const database = await getSupabase();
const store = new Store(database);
const iris: Iris = {
  db:      database,
  discord: new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
  slack: new App({
    customRoutes: [
      {
        handler: (_request, response): void => {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- It's a server response.
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.end("Iris is running!");
        },
        method: "GET",
        path:   "/health",
      },
      {
        handler: (request, response): void => {
          const data: Array<Uint8Array> = [];
          void logger(iris, "Storing installation...");
          request.on("data", (chunk: Uint8Array) => {
            data.push(chunk);
          });
          request.on("error", (error) => {
            void logger(iris, `Error storing installation: ${String(error)}`);
            // eslint-disable-next-line @typescript-eslint/naming-convention -- It's a server response.
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Failed to store installation.");
          });
          request.on("end", () => {
            const body = Buffer.concat(data).toString();
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- body is a string, but we need to parse it as JSON.
            const json = JSON.parse(body) as SlackUser;
            void iris.store.storeInstallation({
              appId: json.app_id,
              bot:   {
                id:     json.bot_user_id,
                scopes: json.scope.split(","),
                token:  json.access_token,
                userId: json.bot_user_id,
              },
              enterprise: {
                id:   json.enterprise?.id ?? "",
                name: json.enterprise?.name ?? "",
              },
              team: {
                id:   json.team?.id ?? "",
                name: json.team?.name ?? "",
              },
              user: {
                id:     json.authed_user?.id ?? "",
                scopes: json.authed_user?.scope.split(",") ?? [],
                token:  json.authed_user?.access_token ?? "",
              },
            });

            /*
             * TODO: Store the Deepgram integration data
             * This requires adding the following columns to the slack_installs table:
             * - deepgram_project_id
             * - deepgram_api_key
             * - deepgram_api_key_expiration
             * Or creating a separate deepgram_integrations table linked to slack installations
             */
            if (json.deepgram) {
              void logger(iris, `Received Deepgram integration data for project: ${json.deepgram.project_id}`);

              /*
               * Once the database schema is updated, store the Deepgram data here
               * For now, we'll just log it
               */
              void logger(iris, "Deepgram integration data received but not stored - database schema update required");
            }

            // eslint-disable-next-line @typescript-eslint/naming-convention -- It's a server response.
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Installation stored successfully!");
            void logger(iris, "Installation stored successfully.");
          });
        },
        method: "POST",
        path:   "/slack/oauth",
      },
      {
        handler: (request, response): void => {
          void logger(iris, "Deleting installation...");
          const data: Array<Uint8Array> = [];
          request.on("data", (chunk: Uint8Array) => {
            data.push(chunk);
          });
          request.on("error", (error) => {
            void logger(iris, `Error deleting installation: ${String(error)}`);
            // eslint-disable-next-line @typescript-eslint/naming-convention -- It's a server response.
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Failed to delete installation.");
          });
          request.on("end", () => {
            const body = Buffer.concat(data).toString();
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- body is a string, but we need to parse it as JSON.
            const installQuery = JSON.parse(body) as InstallationQuery<boolean>;
            void iris.store.deleteInstallation(installQuery);
            // eslint-disable-next-line @typescript-eslint/naming-convention -- It's a server response.
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Installation deleted successfully!");
            void logger(iris, "Installation deleted successfully.");
          });
        },
        method: "DELETE",
        path:   "/slack/oauth",
      },
    ],
    installationStore: store,
    signingSecret:     process.env.SLACK_SIGNING_SECRET,
    token:             process.env.SLACK_BOT_TOKEN,
  }),
  store: store,
};

mountSlackEvents(iris);
mountDiscordEvents(iris);

await iris.discord.login(process.env.DISCORD_BOT_TOKEN);

await iris.slack.
  start(process.env.PORT ?? 3000).
  then(() => {
    void logger(
      iris,
      `⚡️ Slack app is running on port ${process.env.PORT ?? "3000"}`,
    );
  }).
  catch((error: unknown) => {
    void logger(iris, `Error starting Slack app: ${String(error)}`);
    process.exit(1);
  });
