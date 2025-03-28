from utils.logger import logger

def fetch_thread_messages(app, channel_id, thread_ts):
    response = app.client.conversations_replies(
        channel=channel_id,
        ts=thread_ts,
    )
    messages = response["messages"]
    if not messages:
        logger(app, f"No messages found in thread: {thread_ts} in channel: {channel_id}")
        return None
    messages.sort(key=lambda x: x["ts"])
    return messages
