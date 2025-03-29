# pylint: disable=C0116
from os import environ
from json import dumps
from utils.make_ai_request import make_ai_request

def test_success(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?"},
        {"user": "naomi", "text": "What is the weather like?"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [
            {"message": {"content": "I'm good, thank you!"}}
        ]
    }
    mock_post.return_value = mock_response
    app = mocker.Mock()
    response = make_ai_request(app, messages)
    assert response == "I'm good, thank you!"
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps({
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {
                    "type": "text"
                },
                "messages": list([{ "role": "assistant", "content": "Hello, how are you?" }, { "role": "user", "content": "What is the weather like?" }])
            }),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=10,
    )

def test_bad_status(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?"},
        {"user": "naomi", "text": "What is the weather like?"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_response = mocker.Mock()
    mock_response.status_code = 401
    mock_response.json.return_value = {
        "error": "Unauthorized",
    }
    mock_post.return_value = mock_response
    app = mocker.Mock()
    mock_logger = mocker.Mock()
    mocker.patch("utils.make_ai_request.logger", mock_logger)
    response = make_ai_request(app, messages)
    assert response == "There was an error generating a response. Please notify Naomi."
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps({
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {
                    "type": "text"
                },
                "messages": list([{ "role": "assistant", "content": "Hello, how are you?" }, { "role": "user", "content": "What is the weather like?" }])
            }),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=10,
    )
    mock_logger.assert_called_once_with(app, "GNOSIS Error: {'error': 'Unauthorized'}")

def test_exception(mocker):
    environ["GNOSIS_TOKEN"] = "test_key"
    messages = [
        {"user": "U08KECNAEP9", "text": "Hello, how are you?"},
        {"user": "naomi", "text": "What is the weather like?"},
    ]
    mock_post = mocker.patch("utils.make_ai_request.post")
    mock_post.side_effect = Exception("Network error")
    app = mocker.Mock()
    mock_logger = mocker.Mock()
    mocker.patch("utils.make_ai_request.logger", mock_logger)
    response = make_ai_request(app, messages)
    assert response == "There was an error generating a response. Please notify Naomi."
    mock_post.assert_called_once_with(
        url="https://gnosis.deepgram.com/v1/chat/completions",
        data=dumps({
                "model": "gpt-4o",
                "temperature": 1,
                "response_format": {
                    "type": "text"
                },
                "messages": list([{ "role": "assistant", "content": "Hello, how are you?" }, { "role": "user", "content": "What is the weather like?" }])
            }),
        headers={
            "authorization": "Bearer test_key",
        },
        timeout=10,
    )
    mock_logger.assert_called_once_with(app, "Error making AI request: Network error")
