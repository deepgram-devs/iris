import type { KnownBlock } from "@slack/web-api"

export const generateFeedbackBlocks = (content: string): KnownBlock[] => {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": content,
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
                    "text": {"type": "plain_text", "text": "👍🏻", "emoji": true},
                    "value": "feedback-positive",
                    "action_id": "feedback-positive",
                    "style": "primary",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "👎🏻", "emoji": true},
                    "value": "feedback-negative",
                    "action_id": "feedback-negative",
                    "style": "danger",
                },
            ],
        },
    ]
}