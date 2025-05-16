import os
from utils.logger import logger


def process_feedback(app, body, say, feedback_type):
    """
    Processes feedback from the user. Sends a confirmation message back to the user in a thread from that message.

    Args:
        app: The Slack app instance.
        message: The incoming message event from Slack.
        say: The function to send a message back to the user.
        type: The type of feedback (positive or negative).

    Returns:
        None
    Raises:
        Exception: If there is an error processing the feedback or sending the response.
    """
    try:
        logger(app, f"Feedback Payload: {body}")
        message = body["message"]
        user = app.client.users_info(user=body["user"]["id"])["user"]["profile"][
            "display_name"
        ]
        feedback_channel = os.environ.get("FEEDBACK_CHANNEL")
        if feedback_channel is None or feedback_channel == "":
            logger(app, "Feedback channel not set in environment variables.")
            say(
                text="Feedback channel is not configured. Please contact the admin.",
                thread_ts=message["thread_ts"],
            )
            return
        # Fetch previous message in thread to get the question that triggered the answer
        previous_message = app.client.conversations_replies(
            channel=body["channel"]["id"],
            ts=message["thread_ts"],
            latest=message["ts"],
            limit=1,
            inclusive=False,
        )["messages"][0]
        # Sending the feedback to the specified channel
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{feedback_type} Feedback from {message['user']}",
                },
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Feedback from {user}:",
                    }
                ],
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Question: {previous_message['text']}",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Response: {message['text']}",
                },
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Forward to Gnosis!",
                        },
                        "value": "forward-feedback",
                        "action_id": "forward-feedback",
                    }
                ],
            }
        ]
        app.client.chat_postMessage(
            channel=feedback_channel,
            text="Feedback received!",
            blocks=blocks,
        )
        logger(app, f"Parsed feedback type: {feedback_type}\n{blocks}")
        # Sending a confirmation message back to the user
        say(
            text=f"Thank you for your feedback {user}! You selected: {feedback_type}",
            thread_ts=message["thread_ts"],
        )
    except Exception as e:
        print(e)
        logger(app, f"Error processing feedback: {e}")
        say(
            text="There was an error processing your feedback. Please try again later.",
            thread_ts=message["thread_ts"],
        )
