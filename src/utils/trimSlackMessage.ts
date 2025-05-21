/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import type { MinimalSlackMessage } from "../interfaces/minimalSlackMessage.js";
import type {
  FileShareMessageEvent,
  GenericMessageEvent,
} from "@slack/web-api";
import type { MessageElement }
  from "@slack/web-api/dist/types/response/ConversationsHistoryResponse.js";

/**
 * Converts a Slack MessageElement (from conversations.history) to a MinimalSlackMessage
 * with the properties text, ts, and userId.
 * @param message - The Slack message element to be trimmed.
 * @returns A MinimalSlackMessage object.
 */
const trimSlackMessageFromElement = (
  message: MessageElement,
): MinimalSlackMessage => {
  return {
    text:   message.text ?? "⚠️ No text content in this message.",
    ts:     message.ts ?? "1.1",
    userId: message.user ?? "Unknown",
  };
};

/**
 * Converts a Slack message event (from events API) to a MinimalSlackMessage
 * with the properties text, ts, and userId.
 * @param message - The Slack message event to be trimmed.
 * @returns A MinimalSlackMessage object.
 */
const trimSlackMessageFromEvent = (
  message: GenericMessageEvent | FileShareMessageEvent,
): MinimalSlackMessage => {
  return {
    text:   message.text ?? "⚠️ No text content in this message.",
    ts:     message.ts,
    userId: message.user,
  };
};

export { trimSlackMessageFromElement, trimSlackMessageFromEvent };
