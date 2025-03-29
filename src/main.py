"""
    Entry point for the Slack bot.
    Mounts the "message" event listener, authenticates the bot, and starts the app.
"""
from os import environ
from slack_bolt import App
from modules.process_mention import process_mention
from modules.process_dm_message import process_dm_message
from modules.process_thread_response import process_thread_response
from utils.logger import logger

app = App(
    token=environ.get("SLACK_BOT_TOKEN"),
    signing_secret=environ.get("SLACK_SIGNING_SECRET"),
)

@app.event("message")
def callback(message, say):
    """
        Message event listener. Checks if the message meets the criteria to trigger a response:
            - Message must be in a DM with the bot OR
            - Message must mention/tag the bot
        Mounts the "message" event listener, authenticates the bot, and starts the app.
    """
    try:
        if "subtype" in message and message["subtype"] != "message_replied":
            return
        uuid = "<@" + environ.get("BOT_USER_ID") + ">"
        if message["channel_type"] == "im":
            if "thread_ts" in message and message["thread_ts"] is not None:
                logger(app, f"Processing IM message in thread: {message}")
                process_thread_response(app, message, say)
            else:
                logger(app, f"Processing IM message outside of thread: {message}")
                process_dm_message(app, message, say)
        elif (
            message["channel_type"] == "channel"
            or message["channel_type"] == "mpim"
            or message["channel_type"] == "group"
        ):
            if uuid not in message["text"]:
                return
            if "thread_ts" in message and message["thread_ts"] is not None:
                logger(app, f"Processing at-mention in thread: {message}")
                process_thread_response(app, message, say)
            else:
                logger(app, f"Processing at-mention outside of thread: {message}")
                process_mention(app, message, say)
    except Exception as e:
        logger(app, f"Error processing message: {e}")

if __name__ == "__main__":
    app.start(port=int(environ.get("PORT", 3000)))
    print("Slack bot is running...")
    print(app.client.auth_test)
else:
    print(__name__ + " is imported, this module MUST be run as the entry point.")
