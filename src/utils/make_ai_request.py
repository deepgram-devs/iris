from json import dumps
from os import environ
from requests import post
from utils.logger import logger

platformSyntax = {
    "Slack": "<https://example.com|link description/text>",
    "Discord": "[link description/text](https://example.com)",
}


def make_ai_request(app, messages, username, platform):
    """
    Makes a request to the Gnosis AI API with the provided Slack messages.
    Will transform the messages into the standard { role, content }
    format most LLMs use. If the message was authored by this bot's user,
    the role is "assistant", otherwise it is "user".

    Args:
        app: The Slack app instance.
        messages: The messages to include in the AI query.

    Returns:
        str: The AI's response to the query.
            If there is an error, a default error message is returned.
    Raises:
        Exception: If there is an error making the request or processing the response.
    """
    try:
        # If the message author is U08KECNAEP9, { role: "assistant" } else { role: "user" }
        mapped_messages = map(
            lambda message: {
                "role": "assistant" if message["user"] == "U08KECNAEP9" else "user",
                "content": message["text"],
            },
            messages,
        )
        # Add system message to the beginning of the messages
        mapped_messages = [
            {
                "role": "system",
                "content": f"Your name is Iris. You are a {platform} bot that helps users with their questions. Your goal is to be as informative and helpful as possible. Whenever you can, include a link to sources you are referencing. Always use the user's name, {username}. Remember that you must use the appropriate formatting for {platform}, so that your message renders correctly for the user. For example, links must be formatted as {platformSyntax[platform]}. Your responses should never exceed 2000 characters.",
            },
        ] + list(mapped_messages)
        # URL: https://gnosis.deepgram.com/v1/chat/completions
        request = post(
            url="https://gnosis.deepgram.com/v1/chat/completions",
            data=dumps(
                {
                    "model": "gpt-4o",
                    "temperature": 1,
                    "response_format": {"type": "text"},
                    "messages": list(mapped_messages),
                }
            ),
            headers={
                # pylint: disable=W0511
                # TODO: Allow these to be set by each workspace via command + db
                "authorization": "Bearer "
                + environ.get("GNOSIS_TOKEN"),
            },
            timeout=10,
        )
        response = request.json()
        if request.status_code != 200:
            logger(app, f"GNOSIS Error: {response}")
            return "There was an error generating a response. Please notify Naomi."
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        logger(app, f"Error making AI request: {e}")
        return "There was an error generating a response. Please notify Naomi."
