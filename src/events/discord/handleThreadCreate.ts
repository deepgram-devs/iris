/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { appendFeedbackButtons }
  from "../../modules/discord/appendFeedbackButtons.js";
import { errorHandler } from "../../utils/errorHandler.js";
import { getDiscordApiKey } from "../../utils/getApiKey.js";
import { makeAiRequestOnDiscord } from "../../utils/makeAiRequest.js";
import type { Iris } from "../../interfaces/iris.js";
import type { AnyThreadChannel } from "discord.js";

const sleep = async(ms: number): Promise<void> => {
  await new Promise((resolve) => {
    // eslint-disable-next-line no-promise-executor-return -- This is a simple sleep function.
    return setTimeout(resolve, ms);
  });
};

/**
 * Handles the creation of a thread in Discord. Only if the thread
 * is opened in our help channel should the bot automatically respond.
 * @param iris - Iris's instance.
 * @param thread - The thread payload from Discord.
 */
export const handleThreadCreate = async(
  iris: Iris,
  thread: AnyThreadChannel,
): Promise<void> => {
  try {
    if (thread.parent?.id !== process.env.HELP_CHANNEL_ID) {
      return;
    }
    // We wait a few seconds to allow the starter message to be populated.
    await sleep(5000);

    const starter = await thread.fetchStarterMessage();
    if (!starter) {
      return;
    }

    const apiKey = await getDiscordApiKey(iris, thread.guild.id);
    if (apiKey === null) {
      await starter.reply(
        // eslint-disable-next-line stylistic/max-len -- Long string.
        "Sorry, but I could not determine how to authenticate this request. Please try again.",
      );
      return;
    }

    const result = await makeAiRequestOnDiscord(
      iris,
      [ starter ],
      thread.parent?.name ?? "Unknown Channel",
      starter.author.displayName,
      apiKey,
    );

    await starter.reply(appendFeedbackButtons(result));
  } catch (error) {
    await errorHandler(
      iris,
      { error: error, message: "Error in handleThreadCreate" },
      {},
    );
  }
};
