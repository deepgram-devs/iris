/**
 * @copyright Deepgram
 * @license MIT: 
 * @author Naomi Carrigan
 */

import type { Iris } from "../interfaces/iris.js";
import type { MessageElement } from "@slack/web-api/dist/types/response/ConversationsRepliesResponse.js";

const fetchSlackThreadMessages = async(iris: Iris, channelId: string, threadTs: string): Promise<MessageElement[]> => {
    const result = await iris.slack.client.conversations.replies({
        channel: channelId,
        ts: threadTs,
    });

    if (!result.ok) {
        throw new Error(`Error fetching thread messages: ${result.error}`);
    }

    return result.messages ?? [];
}

export { fetchSlackThreadMessages}