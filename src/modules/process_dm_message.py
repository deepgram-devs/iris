import re
from utils.make_ai_request import make_ai_request
from utils.logger import logger


def process_dm_message(app, message, say):
    """
    Processes a direct message from the user. Prompts Gnosis with the
    message text and sends the response back to the user in a thread from that message.

    Args:
        app: The Slack app instance.
        message: The incoming message event from Slack.
        say: The function to send a message back to the user.

    Returns:
        None
    Raises:
        Exception: If there is an error processing the message or sending the response.
    """
    try:
        username = app.client.users_info(user=message["user"])["user"]["profile"][
            "display_name"
        ]
        logger(app, f"Parsed username: {username}")
        response = make_ai_request(app, [message], username, "Slack")
        response = re.sub(r"\*\*(.*?)\*\*", r"*\1*", response)
        # Strip language tags from codeblocks
        response = re.sub(r"```(.*?)\n", "```\n", response)
        blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": response,
                },
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.",
                    }
                ],
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "👍🏻", "emoji": True},
                        "value": "feedback-positive",
                        "action_id": "feedback-positive",
                    },
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "👎🏻", "emoji": True},
                        "value": "feedback-negative",
                        "action_id": "feedback-negative",
                    },
                ],
            },
        ]
        say(blocks=blocks, text=response, thread_ts=message["ts"])
    except Exception as e:
        print(e)
        logger(app, f"Error processing DM message: {e}")
        say(
            text="Sorry, I couldn't process your request at the moment.",
            thread_ts=message["ts"],
        )
