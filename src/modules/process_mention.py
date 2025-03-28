from utils.make_ai_request import make_ai_request
from utils.logger import logger

def process_mention(app, message, body, say):
    try:
        response = make_ai_request(app, [message])
        say(text=response, thread_ts=message["ts"])
    except Exception as e:
        logger(app, f"Error processing mention: {e}")
        say(text="Sorry, I couldn't process your request at the moment.", thread_ts=message["ts"])