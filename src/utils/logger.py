from os import environ

def logger(app, message):
    """
    Pipes a message to the slack channel specified in the LOG_CHANNEL environment variable.

    Args:
        app: The Slack app instance.
        message: The message content to log.

    Returns:
        None
    """
    log_channel = environ.get("LOG_CHANNEL")
    if log_channel is None:
        return
    app.client.chat_postMessage(
        channel=log_channel,
        text=f"```{message}```",
    )
