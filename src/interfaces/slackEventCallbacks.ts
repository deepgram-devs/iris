/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import type { Iris } from "./iris.js";
import type {
  AckFn,
  DialogValidation,
  KnownEventFromType,
  RespondFn,
  SayArguments,
  SayFn,
  SlackAction,
} from "@slack/bolt";

type SlackActionCallback = (
  iris: Iris,
  ack: AckFn<void> | AckFn<string | SayArguments> | AckFn<DialogValidation>,
  body: SlackAction,
  respond: RespondFn,
  teamId: string | undefined,
  enterpriseId: string | undefined
)=> Promise<void>;

type SlackMessageCallback = (
  iris: Iris,
  message: KnownEventFromType<"message">,
  say: SayFn,
  teamId: string | undefined,
  enterpriseId: string | undefined,
)=> Promise<void>;

export type { SlackActionCallback, SlackMessageCallback };
