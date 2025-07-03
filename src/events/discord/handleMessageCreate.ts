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
import type { Message } from "discord.js";

/**
 * Handles the creation of a message in Discord. If Iris is mentioned in the message,
 * trigger a response.
 * @param iris - Iris's instance.
 * @param message - The message payload from Discord.
 */
export const handleMessageCreate = async(
  iris: Iris,
  message: Message,
): Promise<void> => {
  try {
    if (!iris.discord.user || !message.mentions.has(iris.discord.user.id)) {
      return;
    }
    if (!message.inGuild()) {
      await message.reply("Sorry, but DMs are not supported at this time.");
      return;
    }
    const apiKey = await getDiscordApiKey(iris, message.guild.id);
    if (apiKey === null) {
      await message.reply(
        // eslint-disable-next-line stylistic/max-len -- Long string.
        "Sorry, but I could not determine how to authenticate this request. Please try again.",
      );
      return;
    }
    if (!message.channel.isThread()) {
      const result = await makeAiRequestOnDiscord(
        iris,
        [ message ],
        message.channel.name,
        message.author.displayName,
        apiKey,
      );
      const thread = await message.startThread({
        autoArchiveDuration: 60,
        name:                `Thread for ${message.author.username}`,
      });
      await thread.send(appendFeedbackButtons(result));
      return;
    }
    const previousMessages = await message.channel.messages.fetch({
      limit: 100,
    });
    const result = await makeAiRequestOnDiscord(
      iris,
      [ ...previousMessages.values() ],
      message.channel.name,
      message.author.displayName,
      apiKey,
    );
    await message.reply(appendFeedbackButtons(result));
  } catch (error) {
    await errorHandler(
      iris,
      { error: error, message: "Error in handleThreadCreate" },
      { msgReply: message.reply.bind(message) },
    );
  }
};
