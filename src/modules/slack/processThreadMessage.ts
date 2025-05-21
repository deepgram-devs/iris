import type { FileShareMessageEvent, GenericMessageEvent } from "@slack/web-api";
import type { Iris } from "../../interfaces/iris.js";
import { makeAiRequestOnSlack } from "../../utils/makeAiRequest.js";
import { trimSlackMessageFromElement, trimSlackMessageFromEvent } from "../../utils/trimSlackMessage.js";
import type { SayFn } from "@slack/bolt";
import { generateFeedbackBlocks } from "../blocks/generateFeedbackBlocks.js";
import { fetchSlackThreadMessages } from "../../utils/fetchThreadMessages.js";

export const processSlackThreadMessage = async(iris: Iris, message: (GenericMessageEvent | FileShareMessageEvent) & {thread_ts: string}, say: SayFn) => {
    const user = await iris.slack.client.users.info({
        user: message.user,
    });
    const username = user.user?.profile?.display_name ?? user.user?.real_name ?? "Unknown User";
    const channelInfo = await iris.slack.client.conversations.info({
        channel: message.channel,
    });
    const channelName = channelInfo.channel?.name ?? "Unknown Public Thread";
    const previousReplies = await fetchSlackThreadMessages(iris, message.channel, message.thread_ts);
    const previousMessages = previousReplies.filter((msg) => msg.ts !== message.ts);
    const parsedPreviousMessages = previousMessages.map(msg => trimSlackMessageFromElement(msg));
    parsedPreviousMessages.sort((a, b) => {
        const aTs = parseFloat(a.ts ?? "0");
        const bTs = parseFloat(b.ts ?? "0");
        return aTs - bTs;
    });
    const response = await makeAiRequestOnSlack(iris, [...parsedPreviousMessages, trimSlackMessageFromEvent(message)], channelName, username);
    await say({
        text: response,
        blocks: generateFeedbackBlocks(response),
        thread_ts: message.ts,
        channel: message.channel,
    });
}