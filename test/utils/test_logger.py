# pylint: disable=C0116
from os import environ
from utils.logger import logger

def test_success(mocker):
    environ["LOG_CHANNEL"] = "C123456"
    mock_app = mocker.Mock()
    mock_app.client.chat_postMessage = mocker.Mock()
    message = "Test message"
    logger(mock_app, message)
    mock_app.client.chat_postMessage.assert_called_once_with(
        channel="C123456",
        text="```Test message```"
    )

def test_no_log_channel(mocker):
    environ.pop("LOG_CHANNEL")
    mock_app = mocker.Mock()
    mock_app.client.chat_postMessage = mocker.Mock()
    message = "Test message"
    logger(mock_app, message)
    mock_app.client.chat_postMessage.assert_not_called()
    assert environ.get("LOG_CHANNEL") is None
