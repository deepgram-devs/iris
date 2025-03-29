# pylint: disable=C0116
from os import environ
from events.handle_message import handle_message

def test_invalid_subtype(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "subtype": "fake_subtype",
        "channel_type": "im",
        "text": "<@U12345> Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])

def test_exception(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, None, mock_say)
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called, mock_say.called])
    mock_logger.assert_called_with(
        mock_app, "Error processing message: argument of type 'NoneType' is not iterable"
    )

def test_dm_in_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "im",
        "text": "Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing IM message in thread: {mock_message}"
    )
    mock_thread_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_mention_response.assert_not_called()
    mock_dm_response.assert_not_called()

def test_dm_no_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "im",
        "text": "Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing IM message outside of thread: {mock_message}"
    )
    mock_dm_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_mention_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_dm_mention_in_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "im",
        "text": "Hello <@U12345>!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing IM message in thread: {mock_message}"
    )
    mock_thread_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_mention_response.assert_not_called()
    mock_dm_response.assert_not_called()

def test_dm_mention_no_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "im",
        "text": "Hello <@U12345>!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing IM message outside of thread: {mock_message}"
    )
    mock_dm_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_mention_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_mention_in_channel(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "channel",
        "text": "<@U12345> Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention outside of thread: {mock_message}"
    )
    mock_mention_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_mention_in_channel_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "channel",
        "text": "<@U12345> Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention in thread: {mock_message}"
    )
    mock_thread_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_mention_response.assert_not_called()

def test_mention_in_mpim(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "mpim",
        "text": "<@U12345> Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention outside of thread: {mock_message}"
    )
    mock_mention_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_mention_in_mpim_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "mpim",
        "text": "<@U12345> Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention in thread: {mock_message}"
    )
    mock_thread_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_mention_response.assert_not_called()

def test_mention_in_group(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "group",
        "text": "<@U12345> Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention outside of thread: {mock_message}"
    )
    mock_mention_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_mention_in_group_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "group",
        "text": "<@U12345> Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_called_with(
        mock_app, f"Processing at-mention in thread: {mock_message}"
    )
    mock_thread_response.assert_called_once_with(mock_app, mock_message, mock_say)
    mock_dm_response.assert_not_called()
    mock_mention_response.assert_not_called()

def test_no_mention_in_channel(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "channel",
        "text": "Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])

def test_no_mention_in_channel_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "channel",
        "text": "Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])

def test_no_mention_in_mpim(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "mpim",
        "text": "Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    mock_mention_response.assert_not_called()
    mock_dm_response.assert_not_called()
    mock_thread_response.assert_not_called()

def test_no_mention_in_mpim_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "mpim",
        "text": "Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])

def test_no_mention_in_group(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "group",
        "text": "Hello!",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])


def test_no_mention_in_group_thread(mocker):
    environ["BOT_USER_ID"] = "U12345"
    mock_dm_response = mocker.Mock()
    mocker.patch("events.handle_message.process_dm_message", mock_dm_response)
    mock_mention_response = mocker.Mock()
    mocker.patch("events.handle_message.process_mention", mock_mention_response)
    mock_thread_response = mocker.Mock()
    mocker.patch("events.handle_message.process_thread_response", mock_thread_response)
    mock_logger = mocker.Mock()
    mocker.patch("events.handle_message.logger", mock_logger)
    mock_message = {
        "channel_type": "group",
        "text": "Hello!",
        "thread_ts": "1234567890.123456",
    }
    mock_say = mocker.Mock()
    mock_app = mocker.Mock()
    handle_message(mock_app, mock_message, mock_say)
    mock_logger.assert_not_called()
    assert not any([mock_dm_response.called, mock_mention_response.called, mock_thread_response.called])
