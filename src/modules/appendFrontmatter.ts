/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";
import type { Message } from "discord.js";

/**
 * Attaches frontmatter to a Slack message. Data included are
 * username, date, channel name, and whether the message mentions Iris.
 * These data are consumed by Gnosis.
 * @param message - The message to attach frontmatter to.
 * @param channelName - The name of the channel the message was sent in.
 * @param username - The username of the person who sent the message.
 * @param irisId - Iris' bot id.
 * @returns The message with frontmatter attached.
 */
const appendSlackFrontmatter = (
  message: MinimalSlackMessage,
  channelName: string,
  username: string,
  irisId: string,
): string => {
  if (message.ts === undefined || message.userId === undefined) {
    return message.text;
  }
  const [ seconds, milliseconds ] = message.ts.split(".");
  const secondsToTimestamp = Number.parseInt(seconds ?? "0", 10) * 1000;
  const millisecondsToTimestamp = Math.floor(
    Number.parseInt(milliseconds ?? "0", 10) / 1000,
  );
  const date = new Date(
    secondsToTimestamp + millisecondsToTimestamp,
  ).toISOString();
  const mentionsIris = new RegExp(`<@${irisId}>`, "g").test(message.text);
  return `---
user: ${username}
date: ${date}
channel: ${channelName}
mentions: ${mentionsIris
  ? "yes"
  : "no"}
fmt: slack
map: "*bold* _italic_ ~strike~ \`code\` \`\`\`block\`\`\` >quote • bullets 1. nums <url|text>"
---

${message.text}`;
};

/**
 * Attaches frontmatter to a Discord message. Data included are
 * username, date, channel name, and whether the message mentions Iris.
 * These data are consumed by Gnosis.
 * @param message - The message to attach frontmatter to.
 * @param channelName - The name of the channel the message was sent in.
 * @param username - The username of the person who sent the message.
 * @param irisId - Iris' bot id.
 * @returns The message with frontmatter attached.
 */
const appendDiscordFrontmatter = (
  message: Message<true>,
  channelName: string,
  username: string,
  irisId: string,
): string => {
  const date = new Date(
    message.createdTimestamp,
  ).toISOString();
  const mentionsIris = new RegExp(`<@!?${irisId}>`, "g").test(message.content);
  return `---
user: ${username}
date: ${date}
channel: ${channelName}
mentions: ${mentionsIris
  ? "yes"
  : "no"}
fmt: discord
map: "**bold** *italic* __underline__ ~~strike~~ \`code\` \`\`\`js\\ncode\`\`\` > quote - bullets 1. nums (avoid blank lines)"
---

${message.content}`;
};

export { appendSlackFrontmatter, appendDiscordFrontmatter };
