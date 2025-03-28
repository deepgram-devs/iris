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
def callback(message, body, say):
    if "subtype" in message and message["subtype"] is not "message_replied":
        return
    uuid = "<@U08KECNAEP9>"
    if message["channel_type"] == "im":
        if "thread_ts" in message and message["thread_ts"] is not None:
            logger(app, f"Processing IM message in thread: {message}")
            process_thread_response(app, message, body, say)
        else:
            logger(app, f"Processing IM message outside of thread: {message}")
            process_dm_message(app, message, body, say)
    elif message["channel_type"] == "channel" or message["channel_type"] == "mpim" or message["channel_type"] == "group":
        if uuid not in message["text"]:
            return
        if "thread_ts" in message and message["thread_ts"] is not None:
            logger(app, f"Processing at-mention in thread: {message}")
            process_thread_response(app, message, body, say)
        else:
            logger(app, f"Processing at-mention outside of thread: {message}")
            process_mention(app, message, body, say)

if __name__ == "__main__":
    app.start(port=int(environ.get("PORT", 3000)))
    print("Slack bot is running...")
    print(app.client.auth_test)
else:
    print(__name__ + " is imported")