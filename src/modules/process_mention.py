from utils.make_ai_request import make_ai_request
from utils.logger import logger


def process_mention(app, message, say):
    """
    Processes a message which mentions the bot. Prompts Gnosis with the
    message text and sends the response back to the user in a thread from that message.

    Args:
        app: The Slack app instance.
        message: The incoming message event from Slack.
        say: The function to send a message back to the user.

    Returns:
        None
    Raises:
        Exception: If there is an error processing the message or sending the response.
    """
    try:
        username = app.client.users_info(user=message["user"])["user"]["profile"]["display_name"]
        response = make_ai_request(app, [message], username)
        say(text=response, thread_ts=message["ts"])
    except Exception as e:
        logger(app, f"Error processing mention: {e}")
        say(
            text="Sorry, I couldn't process your request at the moment.",
            thread_ts=message["ts"],
        )
