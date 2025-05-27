/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import slackBolt from "@slack/bolt";
import { Client, GatewayIntentBits } from "discord.js";
import { mountDiscordEvents } from "./events/mountDiscordEvents.js";
import { mountSlackEvents } from "./events/mountSlackEvents.js";
import { logger } from "./utils/logger.js";
import type { Iris } from "./interfaces/iris.js";

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
const iris: Iris = {
  discord: new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
  slack: new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token:         process.env.SLACK_BOT_TOKEN,
  }),
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
