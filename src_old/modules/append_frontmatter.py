import datetime


def append_slack_frontmatter(app, message):
    """
    Appends frontmatter to a Slack message. Includes the following:
    - user: The display name of the user who sent the message.
    - ts: The timestamp of the message.
    - channel: The nam of the channel where the message was sent.
    - mentions: Whether the user mentioned the bot specifically, thereby requesting a response from it.

    Args:
        app: The Slack app instance.
        message (dict): The incoming message event from Slack.

    Returns:
        dict: The modified message with frontmatter appended.
    """
    # Add frontmatter to the message
    text = message["text"]
    username = app.client.users_info(user=message["user"])["user"]["profile"][
        "display_name"
    ]
    ts = message["ts"]
    seconds, milliseconds = map(int, ts.split("."))
    # Set timezone to UTC
    date = datetime.datetime.fromtimestamp(
        seconds, datetime.timezone.utc
    ) + datetime.timedelta(milliseconds=milliseconds)
    channel_name = (
        app.client.conversations_info(channel=message["channel"])["channel"]["name"]
        if "channel_type" in message and message["channel_type"] == "channel"
        else "Unknown"
    )
    mentions = "Yes" if "<@U08KECNAEP9>" in text else "No"
    return f"""---
user: {username}
date: {date}
channel: {channel_name}
mentions: {mentions}
---

{text}
"""
