from utils.fetch_thread_messages import fetch_thread_messages

def process_thread_response(app, message, body, say):
    past_replies = fetch_thread_messages(app, message["channel"], message["thread_ts"])
    say(text=f"I see you in this thread! There are {len(past_replies)} messages here.", thread_ts=message["thread_ts"])