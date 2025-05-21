/**
 * @copyright Deepgram
 * @license MIT: 
 * @author Naomi Carrigan
 */

import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";

const appendSlackFrontmatter = (message: MinimalSlackMessage, channelName: string, username: string, irisId: string): string => {
    if (!message.text) {
        return "⚠️ No text found in message";
    }
    if (!message.ts || !message.userId) {
        return message.text;
    }
    const [ seconds, milliseconds ] = message.ts.split(".") as [string, string];
    const date = new Date(parseInt(seconds) * 1000 + parseInt(milliseconds)).toISOString();
    const mentionsIris = new RegExp(`<@${irisId}>`, "g").test(message.text);
    return `---
user: ${username}
date: ${date}
channel: ${channelName}
mentions: ${mentionsIris}
---

${message.text}`;
}

export { appendSlackFrontmatter };