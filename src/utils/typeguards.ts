/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { KnownEventFromType } from "@slack/bolt";

/**
 * Asserts that the thread_ts property is present in the message object and is a non-empty string.
 * @param message - The message object to check.
 * @returns True if the message is in a thread, false otherwise.
 */
const isSlackMessageInThread = (
  message: KnownEventFromType<"message">,
// eslint-disable-next-line @typescript-eslint/naming-convention -- API convention.
): message is KnownEventFromType<"message"> & { thread_ts: string } => {
  return (
    "thread_ts" in message
    && typeof message.thread_ts === "string"
    && message.thread_ts.length > 0
  );
};

export { isSlackMessageInThread };
