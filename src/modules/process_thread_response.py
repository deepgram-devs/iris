def process_thread_response(message, body, say):
    say(text=f"I see you in this thread!", thread_ts=message["thread_ts"])