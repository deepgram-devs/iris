/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import { App } from "@slack/bolt";
import type { Iris } from "./interfaces/iris.js";
import { mountSlackEvents } from "./events/mountSlackEvents.js";

if (
  process.env.SLACK_SIGNING_SECRET === undefined
  || process.env.SLACK_BOT_TOKEN === undefined
) {
  throw new Error(
    "SLACK_SIGNING_SECRET and SLACK_BOT_TOKEN must be set in the environment variables.",
  );
}

const iris: Iris = {
  slack: new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token:         process.env.SLACK_BOT_TOKEN,
  }),
};

mountSlackEvents(iris);

await iris.slack.
  start(process.env.PORT ?? 3000).
  then(() => {
    console.log(`⚡️ Slack app is running on port ${process.env.PORT ?? 3000}`);
  }).
  catch((error) => {
    console.error("Error starting Slack app:", error);
    process.exit(1);
  });
