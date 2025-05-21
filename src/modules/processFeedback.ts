/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Iris } from "../interfaces/iris.js"
import type {  RespondFn, BlockAction, BlockElementAction} from "@slack/bolt";

export const processFeedback = async (iris: Iris, body: BlockAction<BlockElementAction>, respond: RespondFn, feedbackType: "positive" | "negative") => {
    const { message } = body;
    if (!message) {
        await respond({
            text: "No message found in the feedback payload.",
            response_type: "ephemeral",
        });
        return;
    }
    const user = message.user ? (await iris.slack.client.users.info({
        user: message.user,
    })).user?.profile?.display_name ?? "Unknown User" : "Unknown User";
    const channelId = process.env.FEEDBACK_CHANNEL;
    if (!channelId) {
        await respond({
            text: "Feedback channel not set in environment variables.",
            response_type: "ephemeral",
            thread_ts: message.thread_ts,
        })
        return;
    }
    const previousMessageReq = await iris.slack.client.conversations.replies({
        channel: message.channel,
        ts: message.thread_ts,
        latest: message.ts,
        limit: 1,
        inclusive: false,
    });
    const previousMessage = previousMessageReq.messages?.[0];
    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: `${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)} Feedback`,
            },
        },
        {
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: `Feedback from ${user}:`,
                },
            ],
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `Question: ${previousMessage?.text}`,
            },
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `Response: ${message.text}`,
            },
        },
    ]
    await iris.slack.client.chat.postMessage({
        channel: channelId,
        text: "Feedback received!",
        blocks,
    });
    await respond({
        text: `Thank you for your feedback, ${user}! You selected: ${feedbackType}`,
        response_type: "ephemeral",
        thread_ts: message.thread_ts,
    });
}
