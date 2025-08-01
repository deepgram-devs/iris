/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { platformSyntax } from "../config/platformSyntax.js";
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

/**
 * Checks if a property is in the platform syntax object for a given platform.
 * @param platform - The platform to check.
 * @param property - The property to check.
 * @returns True if the property is in the platform syntax object, false otherwise.
 */
const isPropertyInPlatformSyntaxObject = (
  platform: keyof typeof platformSyntax,
  property: string,
): property is keyof (typeof platformSyntax)[typeof platform] => {
  return property in platformSyntax[platform];
};

/**
 * Confirms that the JSON object received from Supabase is a proper
 * encryption payload.
 * @param object - The object to check.
 * @returns True if the object is a valid encryption payload, false otherwise.
 */
const isEncryptionObject = (
  object: unknown,
): object is { encrypted: string; iv: string; tag: string } => {
  return (
    typeof object === "object"
    && object !== null
    && !Array.isArray(object)
    && "encrypted" in object
    && "iv" in object
    && "tag" in object
  );
};

export {
  isSlackMessageInThread,
  isPropertyInPlatformSyntaxObject,
  isEncryptionObject,
};
