from utils.make_ai_request import make_ai_request

def process_dm_message(app, message, body, say):
    response = make_ai_request(app, [message])
    say(text=response, thread_ts=message["ts"])