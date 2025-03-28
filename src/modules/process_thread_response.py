from utils.fetch_thread_messages import fetch_thread_messages
from utils.make_ai_request import make_ai_request

def process_thread_response(app, message, body, say):
    past_replies = fetch_thread_messages(app, message["channel"], message["thread_ts"])
    result = make_ai_request(app, past_replies)
    say(text=result, thread_ts=message["thread_ts"])