import type { FileShareMessageEvent, GenericMessageEvent } from "@slack/web-api";
import type { Iris } from "../../interfaces/iris.js";
import { makeAiRequestOnSlack } from "../../utils/makeAiRequest.js";
import { trimSlackMessageFromEvent } from "../../utils/trimSlackMessage.js";
import type { SayFn } from "@slack/bolt";
import { generateFeedbackBlocks } from "../blocks/generateFeedbackBlocks.js";

export const processSlackDmMessage = async(iris: Iris, message: GenericMessageEvent | FileShareMessageEvent, say: SayFn) => {
    const user = await iris.slack.client.users.info({
        user: message.user,
    });
    const username = user.user?.profile?.display_name ?? user.user?.real_name ?? "Unknown User";
    const channelName = "Direct Messages";
    const response = await makeAiRequestOnSlack(iris, [trimSlackMessageFromEvent(message)], channelName, username);
    await say({
        text: response,
        blocks: generateFeedbackBlocks(response),
        thread_ts: message.ts,
        channel: message.channel,
    });
}