from utils.fetch_thread_messages import fetch_thread_messages

def test_success(mocker):
    mock_app = mocker.Mock()
    mock_app.client.conversations_replies.return_value = {
        "messages": [
            {"ts": "1234567890.654321", "text": "Message 1"},
            {"ts": "1234567890.123456", "text": "Message 2"},
        ]
    }
    result = fetch_thread_messages(mock_app, "C123456", "1234567890.123456")
    mock_app.client.conversations_replies.assert_called_once_with(
        channel="C123456",
        ts="1234567890.123456",
    )
    assert result == [
        {"ts": "1234567890.123456", "text": "Message 2"},
        {"ts": "1234567890.654321", "text": "Message 1"},
    ]

def test_no_messages(mocker):
    mock_logger = mocker.Mock()
    mocker.patch('utils.fetch_thread_messages.logger', mock_logger)
    mock_app = mocker.Mock()
    mock_app.client.conversations_replies.return_value = {"messages": []}
    result = fetch_thread_messages(mock_app, "C123456", "1234567890.123456")
    mock_app.client.conversations_replies.assert_called_once_with(
        channel="C123456",
        ts="1234567890.123456",
    )
    mock_logger.assert_called_once_with(
        mock_app,
        "No messages found in thread: 1234567890.123456 in channel: C123456",
    )
    assert result is None

def test_error(mocker):
    mock_logger = mocker.Mock()
    mocker.patch('utils.fetch_thread_messages.logger', mock_logger)
    mock_app = mocker.Mock()
    mock_app.client.conversations_replies.side_effect = Exception("API Error")
    result = fetch_thread_messages(mock_app, "C123456", "1234567890.123456")
    mock_app.client.conversations_replies.assert_called_once_with(
        channel="C123456",
        ts="1234567890.123456",
    )
    mock_logger.assert_called_once_with(
        mock_app,
        "Error fetching thread messages: API Error",
    )
    assert result is None
