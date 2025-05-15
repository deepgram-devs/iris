from json import dumps
from os import environ
from requests import post
from utils.logger import logger
from utils.generate_prompt import generate_prompt
from modules.append_frontmatter import append_slack_frontmatter

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
                "content": append_slack_frontmatter(app, message),
            },
            messages,
        )
        # Add system message to the beginning of the messages
        mapped_messages = [
            {
                "role": "system",
                # We're disabling the line length check here because the prompt cannot be shortened.
                # pylint: disable=C0301
                "content": generate_prompt(
                    username,
                    platform,
                ),
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
            timeout=60,
        )
        response = request.json()
        if request.status_code != 200:
            logger(app, f"GNOSIS Error: {response}")
            return "There was an error generating a response. Please notify Naomi."
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        logger(app, f"Error making AI request: {e}")
        return "There was an error generating a response. Please notify Naomi."
