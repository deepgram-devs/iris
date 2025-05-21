/**
 * This is a custom type that allows us to pay attention only to the properties we care about in a Slack message.
 */
export interface MinimalSlackMessage {
    text: string;
    userId?: string;
    ts?: string;
}