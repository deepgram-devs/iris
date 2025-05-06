from utils.fetch_thread_messages import fetch_thread_messages
from utils.make_ai_request import make_ai_request
from utils.logger import logger


def process_thread_response(app, message, say):
    """
    Processes a threaded message. In a DM context, this is any response sent by the user
    in a thread. In a non-DM context, the message should mention the bot. Prompts Gnosis with the
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
        past_replies = fetch_thread_messages(
            app, message["channel"], message["thread_ts"]
        )
        username = app.client.users_info(user=message["user"])["user"]["profile"]["display_name"]
        result = make_ai_request(app, past_replies, username)
        say(text=result, thread_ts=message["thread_ts"])
    except Exception as e:
        logger(app, f"Error processing thread response: {e}")
        say(
            text="Sorry, I couldn't process your request at the moment.",
            thread_ts=message["thread_ts"],
        )
