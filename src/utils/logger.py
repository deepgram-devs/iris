from os import environ

def logger(app, message):
    log_channel = environ.get("LOG_CHANNEL")
    if log_channel is None:
        return
    app.client.chat_postMessage(
        channel=log_channel,
        text=f"```{message}```",
    )
