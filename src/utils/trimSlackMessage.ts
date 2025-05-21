import type { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse.js";
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";
import type { FileShareMessageEvent, GenericMessageEvent } from "@slack/web-api";

const trimSlackMessageFromElement = (message: MessageElement): MinimalSlackMessage => {
    return {
        userId: message.user ?? "Unknown",
        ts: message.ts ?? "1.1",
        text: message.text ?? "⚠️ No text content in this message.",
    }
}

const trimSlackMessageFromEvent = (message: GenericMessageEvent | FileShareMessageEvent): MinimalSlackMessage => {
    return {
        userId: message.user,
        ts: message.ts,
        text: message.text ?? "⚠️ No text content in this message.",
    }
}

export { trimSlackMessageFromElement, trimSlackMessageFromEvent };