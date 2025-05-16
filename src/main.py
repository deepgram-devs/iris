"""
Entry point for the Slack bot.
Mounts the "message" event listener, authenticates the bot, and starts the app.
"""

from os import environ
from slack_bolt import App
from events.handle_message import handle_message
from modules.process_feedback import process_feedback

app = App(
    token=environ.get("SLACK_BOT_TOKEN"),
    signing_secret=environ.get("SLACK_SIGNING_SECRET"),
)


@app.action("feedback-positive")
def handle_feedback_positive(ack, body, say):
    """
    Handles positive feedback from the user. Acknowledges the action and
    sends a message to the user.
    """
    ack()
    process_feedback(app, body, say, "Positive")


@app.action("feedback-negative")
def handle_feedback_negative(ack, body, say):
    """
    Handles negative feedback from the user. Acknowledges the action and
    sends a message to the user.
    """
    ack()
    process_feedback(app, body, say, "Negative")


@app.event("message")
def callback(message, say):
    """
    Wrapper for the event listener. Passes the message and
    say function to the handle_message function.
    """
    handle_message(app, message, say)


if __name__ == "__main__":
    app.start(port=int(environ.get("PORT", 3000)))
    print("Slack bot is running...")
    print(app.client.auth_test)
else:
    print(__name__ + " is imported, this module MUST be run as the entry point.")
