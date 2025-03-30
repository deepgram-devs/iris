from utils.logger import logger


def fetch_thread_messages(app, channel_id, thread_ts):
    """
    Fetches all messages from a thread in a Slack channel.

    Args:
        app: The Slack app instance.
        message: The incoming message event from Slack.
        say: The function to send a message back to the user.

    Returns:
        list: A list of messages in the thread, sorted by timestamp.
        None: If no messages are found or if there is an error.
    Raises:
        Exception: If there is an error fetching the messages.
    """
    try:
        response = app.client.conversations_replies(
            channel=channel_id,
            ts=thread_ts,
        )
        messages = response["messages"]
        if not messages:
            logger(
                app,
                f"No messages found in thread: {thread_ts} in channel: {channel_id}",
            )
            return None
        messages.sort(key=lambda x: x["ts"])
        return messages
    except Exception as e:
        logger(app, f"Error fetching thread messages: {e}")
        return None
