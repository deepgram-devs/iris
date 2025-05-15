# pylint: disable=C0116
from os import environ
from json import dumps
from utils.make_ai_request import make_ai_request
from utils.generate_prompt import generate_prompt
from modules.append_frontmatter import append_slack_frontmatter


def test_success(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?", "ts": "1234567890.123456", "channel": "C12345678"},
        {"user": "naomi", "text": "What is the weather like?", "ts": "1234567890.123456", "channel": "C12345678"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "I'm good, thank you!"}}]
    }
    mock_post.return_value = mock_response
    app = mocker.Mock()
    app.client.users_info.return_value = {
        "user": {"profile": {"display_name": "test_user"}}
    }
    app.client.conversations_info.return_value = {
        "channel": {"name": "test_channel"}
    }
    response = make_ai_request(app, messages, "naomi", "Slack")
    assert response == "I'm good, thank you!"
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps(
            {
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {"type": "text"},
                "messages": list(
                    [
                        # pylint: disable=C0301
                        {
                            "role": "system",
                            "content": generate_prompt(
                                "naomi",
                                "Slack",
                            ),
                        },
                        {"role": "assistant", "content": append_slack_frontmatter(app, messages[0])},
                        {"role": "user", "content": append_slack_frontmatter(app, messages[1])},
                    ]
                ),
            }
        ),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=60,
    )


def test_bad_status(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?", "ts": "1234567890.123456", "channel": "C12345678"},
        {"user": "naomi", "text": "What is the weather like?", "ts": "1234567890.123456", "channel": "C12345678"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_response = mocker.Mock()
    mock_response.status_code = 401
    mock_response.json.return_value = {
        "error": "Unauthorized",
    }
    mock_post.return_value = mock_response
    app = mocker.Mock()
    app.client.users_info.return_value = {
        "user": {"profile": {"display_name": "test_user"}}
    }
    app.client.conversations_info.return_value = {
        "channel": {"name": "test_channel"}
    }
    mock_logger = mocker.Mock()
    mocker.patch("utils.make_ai_request.logger", mock_logger)
    response = make_ai_request(app, messages, "naomi", "Slack")
    assert response == "There was an error generating a response. Please notify Naomi."
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps(
            {
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {"type": "text"},
                "messages": list(
                    [
                        # pylint: disable=C0301
                        {
                            "role": "system",
                            "content": generate_prompt(
                                "naomi",
                                "Slack",
                            ),
                        },
                        {"role": "assistant", "content": append_slack_frontmatter(app, messages[0])},
                        {"role": "user", "content": append_slack_frontmatter(app, messages[1])},
                    ]
                ),
            }
        ),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=60,
    )
    mock_logger.assert_called_once_with(app, "GNOSIS Error: {'error': 'Unauthorized'}")


def test_exception(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?", "ts": "1234567890.123456", "channel": "C12345678"},
        {"user": "naomi", "text": "What is the weather like?", "ts": "1234567890.123456", "channel": "C12345678"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_post.side_effect = Exception("Network error")
    app = mocker.Mock()
    app.client.users_info.return_value = {
        "user": {"profile": {"display_name": "test_user"}}
    }
    app.client.conversations_info.return_value = {
        "channel": {"name": "test_channel"}
    }
    mock_logger = mocker.Mock()
    mocker.patch("utils.make_ai_request.logger", mock_logger)
    response = make_ai_request(app, messages, "naomi", "Slack")
    assert response == "There was an error generating a response. Please notify Naomi."
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps(
            {
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {"type": "text"},
                "messages": list(
                    [
                        # pylint: disable=C0301
                        {
                            "role": "system",
                            "content": generate_prompt(
                                "naomi",
                                "Slack",
                            ),
                        },
                        {"role": "assistant", "content": append_slack_frontmatter(app, messages[0])},
                        {"role": "user", "content": append_slack_frontmatter(app, messages[1])},
                    ]
                ),
            }
        ),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=60,
    )
    mock_logger.assert_called_once_with(app, "Error making AI request: Network error")
