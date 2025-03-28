from requests import post
from os import environ
from utils.logger import logger
from json import dumps

def make_ai_request(app, messages):
    # If the message author is U08KECNAEP9, { role: "assistant" } else { role: "user" }
    mapped_messages = map(
        lambda message: {
            "role": "assistant" if message["user"] == "U08KECNAEP9" else "user",
            "content": message["text"],
        },
        messages,
    )
    # URL: https://gnosis.deepgram.com/v1/chat/completions
    request = post(url="https://gnosis.deepgram.com/v1/chat/completions", data=dumps({
        "model": "gpt-4o",
        "temperature": 1,
        "response_format": {
            "type": "text"
        },
        "messages": list(mapped_messages),
    }),
    headers={
        # TODO: Allow these to be set by each workspace via command + db
        "authorization": "Bearer " + environ.get("GNOSIS_TOKEN"),
    })
    response = request.json()
    if request.status_code != 200:
        logger(app, f"GNOSIS Error: {response}")
        return "There was an error generating a response. Please notify Naomi."
    return response["choices"][0]["message"]["content"]
