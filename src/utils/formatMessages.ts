/**
 * @copyright Deepgram
 * @license MIT: 
 * @author Naomi Carrigan
 */

import { appendSlackFrontmatter } from "../modules/appendFrontmatter.js";
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";

const formatSlackMessages = (messages: MinimalSlackMessage[], channelName: string, username: string, irisId: string): { role: string; content: string }[] => {
    const formattedMessages = messages.map((message) => {
        const role = message.userId === irisId ? "assistant" : "user";
        return {
            role,
            content: appendSlackFrontmatter(message, channelName, username, irisId),
        };
    });
    return formattedMessages;
}

export { formatSlackMessages };