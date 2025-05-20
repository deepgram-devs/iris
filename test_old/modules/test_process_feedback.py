from os import environ
from modules.process_feedback import process_feedback


def test_process_feedback(mocker):
    """
    Test the process_feedback function.
    """
    environ["FEEDBACK_CHANNEL"] = "C12345"
    mock_thread_request = mocker.Mock()
    mock_thread_request.return_value = {
        "messages": [
            {
                "user": "U079TFYDT8X",
                "text": "Hey Iris! How are you?",
                "ts": "1747352242.168559",
                "bot_id": "B08KECN9AFR",
                "app_id": "A08KXEYD6P5",
                "team": "T06SK07V473",
                "thread_ts": "1747352238.476939",
                "parent_user_id": "U079TFYDT8X",
            }
        ]
    }
    mocked_say = mocker.Mock()
    mock_user_request = mocker.Mock()
    mock_user_request.return_value = {"user": {"profile": {"display_name": "Naomi"}}}
    mock_send = mocker.Mock()
    mock_client = mocker.Mock(
        client=mocker.Mock(
            users_info=mock_user_request,
            conversations_replies=mock_thread_request,
            chat_postMessage=mock_send,
        )
    )
    process_feedback(
        mock_client,
        {
            "type": "block_actions",
            "user": {
                "id": "U079TFYDT8X",
                "username": "naomi.carrigan",
                "name": "naomi.carrigan",
                "team_id": "T06SK07V473",
            },
            "api_app_id": "A08KXEYD6P5",
            "token": "qLSChpR9wAfmA1OlmDyOKVTB",
            "container": {
                "type": "message",
                "message_ts": "1747352242.168559",
                "channel_id": "C06S6A9N1AN",
                "is_ephemeral": False,
                "thread_ts": "1747352238.476939",
            },
            "trigger_id": "8909146312964.6903007990241.f6391258f966934b6c8ade7b8ea4b2bf",
            "team": {"id": "T06SK07V473", "domain": "deepgramsandbox"},
            "enterprise": None,
            "is_enterprise_install": False,
            "channel": {"id": "C06S6A9N1AN", "name": "general"},
            "message": {
                "user": "U08KECNAEP9",
                "type": "message",
                "ts": "1747352242.168559",
                "bot_id": "B08KECN9AFR",
                "app_id": "A08KXEYD6P5",
                "text": "Hi Naomi! How can I assist you today? :blush:",
                "team": "T06SK07V473",
                "thread_ts": "1747352238.476939",
                "parent_user_id": "U079TFYDT8X",
                "blocks": [
                    {
                        "type": "section",
                        "block_id": "RjBFR",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hi Naomi! How can I assist you today? :blush:",
                            "verbatim": False,
                        },
                    },
                    {
                        "type": "context",
                        "block_id": "cYonS",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": "Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.",
                                "verbatim": False,
                            }
                        ],
                    },
                    {
                        "type": "actions",
                        "block_id": "2KfVW",
                        "elements": [
                            {
                                "type": "button",
                                "action_id": "feedback-positive",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":+1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-positive",
                            },
                            {
                                "type": "button",
                                "action_id": "feedback-negative",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":-1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-negative",
                            },
                        ],
                    },
                ],
            },
            "state": {"values": {}},
            "response_url": "https://hooks.slack.com/actions/T06SK07V473/8909146293940/2mkQaqbpae9zG8lcJrSzngKs",
            "actions": [
                {
                    "action_id": "feedback-positive",
                    "block_id": "2KfVW",
                    "text": {
                        "type": "plain_text",
                        "text": ":+1::skin-tone-2:",
                        "emoji": True,
                    },
                    "value": "feedback-positive",
                    "type": "button",
                    "action_ts": "1747352385.327164",
                }
            ],
        },
        mocked_say,
        "Positive",
    )
    mocked_say.assert_called_once_with(
        text="Thank you for your feedback Naomi! You selected: Positive",
        thread_ts="1747352238.476939",
    )
    mock_send.assert_called_once_with(
        channel="C12345",
        text="Feedback received!",
        blocks=[
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Positive Feedback from U08KECNAEP9",
                },
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "Feedback from Naomi:",
                    }
                ],
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Question: Hey Iris! How are you?",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Response: Hi Naomi! How can I assist you today? :blush:",
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
            },
        ],
    )


def test_no_feedback_channel(mocker):
    """
    Test the process_feedback function when no feedback channel is configured.
    """
    environ["FEEDBACK_CHANNEL"] = ""
    mock_thread_request = mocker.Mock()
    mock_thread_request.return_value = {
        "messages": [
            {
                "user": "U08KECNAEP9",
                "text": "Hi Naomi! How can I assist you today? :blush:",
                "ts": "1747352242.168559",
                "bot_id": "B08KECN9AFR",
                "app_id": "A08KXEYD6P5",
                "team": "T06SK07V473",
                "thread_ts": "1747352238.476939",
                "parent_user_id": "U079TFYDT8X",
            }
        ]
    }
    mocked_say = mocker.Mock()
    mock_user_request = mocker.Mock()
    mock_user_request.return_value = {"user": {"profile": {"display_name": "naomi"}}}
    mock_send = mocker.Mock()
    mock_client = mocker.Mock(
        client=mocker.Mock(
            users_info=mock_user_request,
            conversations_replies=mock_thread_request,
            chat_postMessage=mock_send,
        )
    )
    process_feedback(
        mock_client,
        {
            "type": "block_actions",
            "user": {
                "id": "U079TFYDT8X",
                "username": "naomi.carrigan",
                "name": "naomi.carrigan",
                "team_id": "T06SK07V473",
            },
            "api_app_id": "A08KXEYD6P5",
            "token": "qLSChpR9wAfmA1OlmDyOKVTB",
            "container": {
                "type": "message",
                "message_ts": "1747352242.168559",
                "channel_id": "C06S6A9N1AN",
                "is_ephemeral": False,
                "thread_ts": "1747352238.476939",
            },
            "trigger_id": "8909146312964.6903007990241.f6391258f966934b6c8ade7b8ea4b2bf",
            "team": {"id": "T06SK07V473", "domain": "deepgramsandbox"},
            "enterprise": None,
            "is_enterprise_install": False,
            "channel": {"id": "C06S6A9N1AN", "name": "general"},
            "message": {
                "user": "U08KECNAEP9",
                "type": "message",
                "ts": "1747352242.168559",
                "bot_id": "B08KECN9AFR",
                "app_id": "A08KXEYD6P5",
                "text": "Hi Naomi! How can I assist you today? :blush:",
                "team": "T06SK07V473",
                "thread_ts": "1747352238.476939",
                "parent_user_id": "U079TFYDT8X",
                "blocks": [
                    {
                        "type": "section",
                        "block_id": "RjBFR",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hi Naomi! How can I assist you today? :blush:",
                            "verbatim": False,
                        },
                    },
                    {
                        "type": "context",
                        "block_id": "cYonS",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": "Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.",
                                "verbatim": False,
                            }
                        ],
                    },
                    {
                        "type": "actions",
                        "block_id": "2KfVW",
                        "elements": [
                            {
                                "type": "button",
                                "action_id": "feedback-positive",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":+1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-positive",
                            },
                            {
                                "type": "button",
                                "action_id": "feedback-negative",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":-1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-negative",
                            },
                        ],
                    },
                ],
            },
            "state": {"values": {}},
            "response_url": "https://hooks.slack.com/actions/T06SK07V473/8909146293940/2mkQaqbpae9zG8lcJrSzngKs",
            "actions": [
                {
                    "action_id": "feedback-positive",
                    "block_id": "2KfVW",
                    "text": {
                        "type": "plain_text",
                        "text": ":+1::skin-tone-2:",
                        "emoji": True,
                    },
                    "value": "feedback-positive",
                    "type": "button",
                    "action_ts": "1747352385.327164",
                }
            ],
        },
        mocked_say,
        "Positive",
    )
    mocked_say.assert_called_once_with(
        text="Feedback channel is not configured. Please contact the admin.",
        thread_ts="1747352238.476939",
    )


def test_error(mocker):
    """
    Test the process_feedback function when there is an error processing the feedback.
    """
    environ["FEEDBACK_CHANNEL"] = "C12345"
    mock_thread_request = mocker.Mock()
    mock_thread_request.side_effect = Exception("Error fetching thread")
    mocked_say = mocker.Mock()
    mock_user_request = mocker.Mock()
    mock_user_request.return_value = {"user": {"profile": {"display_name": "naomi"}}}
    mock_send = mocker.Mock()
    mock_client = mocker.Mock(
        client=mocker.Mock(
            users_info=mock_user_request,
            conversations_replies=mock_thread_request,
            chat_postMessage=mock_send,
        )
    )
    process_feedback(
        mock_client,
        {
            "type": "block_actions",
            "user": {
                "id": "U079TFYDT8X",
                "username": "naomi.carrigan",
                "name": "naomi.carrigan",
                "team_id": "T06SK07V473",
            },
            "api_app_id": "A08KXEYD6P5",
            "token": "qLSChpR9wAfmA1OlmDyOKVTB",
            "container": {
                "type": "message",
                "message_ts": "1747352242.168559",
                "channel_id": "C06S6A9N1AN",
                "is_ephemeral": False,
                "thread_ts": "1747352238.476939",
            },
            "trigger_id": "8909146312964.6903007990241.f6391258f966934b6c8ade7b8ea4b2bf",
            "team": {"id": "T06SK07V473", "domain": "deepgramsandbox"},
            "enterprise": None,
            "is_enterprise_install": False,
            "channel": {"id": "C06S6A9N1AN", "name": "general"},
            "message": {
                "user": "U08KECNAEP9",
                "type": "message",
                "ts": "1747352242.168559",
                "bot_id": "B08KECN9AFR",
                "app_id": "A08KXEYD6P5",
                "text": "Hi Naomi! How can I assist you today? :blush:",
                "team": "T06SK07V473",
                "thread_ts": "1747352238.476939",
                "parent_user_id": "U079TFYDT8X",
                "blocks": [
                    {
                        "type": "section",
                        "block_id": "RjBFR",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hi Naomi! How can I assist you today? :blush:",
                            "verbatim": False,
                        },
                    },
                    {
                        "type": "context",
                        "block_id": "cYonS",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": "Please use the buttons below to provide feedback *on the accuracy of the response ONLY*. Please do NOT use this system to indicate your satisfaction with the answer itself.",
                                "verbatim": False,
                            }
                        ],
                    },
                    {
                        "type": "actions",
                        "block_id": "2KfVW",
                        "elements": [
                            {
                                "type": "button",
                                "action_id": "feedback-positive",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":+1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-positive",
                            },
                            {
                                "type": "button",
                                "action_id": "feedback-negative",
                                "text": {
                                    "type": "plain_text",
                                    "text": ":-1::skin-tone-2:",
                                    "emoji": True,
                                },
                                "value": "feedback-negative",
                            },
                        ],
                    },
                ],
            },
            "state": {"values": {}},
            "response_url": "https://hooks.slack.com/actions/T06SK07V473/8909146293940/2mkQaqbpae9zG8lcJrSzngKs",
            "actions": [
                {
                    "action_id": "feedback-positive",
                    "block_id": "2KfVW",
                    "text": {
                        "type": "plain_text",
                        "text": ":+1::skin-tone-2:",
                        "emoji": True,
                    },
                    "value": "feedback-positive",
                    "type": "button",
                    "action_ts": "1747352385.327164",
                }
            ],
        },
        mocked_say,
        "Positive",
    )
    mocked_say.assert_called_once_with(
        text="There was an error processing your feedback. Please try again later.",
        thread_ts="1747352238.476939",
    )
