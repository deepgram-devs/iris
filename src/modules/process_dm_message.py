def process_dm_message(message, body, say):
    say(text=f"I see you in this dm!", thread_ts=message["ts"])