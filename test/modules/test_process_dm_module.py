# pylint: disable=C0116
from modules.process_dm_message import process_dm_message


def test_success(mocker):
    mock_request = mocker.Mock()
    mock_request.return_value = "mocked response"
    mocker.patch("modules.process_dm_message.make_ai_request", mock_request)
    mocked_say = mocker.Mock()
    process_dm_message({}, {"ts": 1, "user": "naomi", "text": "naomi"}, mocked_say)
    mock_request.assert_called_once_with(
        {}, [{"ts": 1, "user": "naomi", "text": "naomi"}]
    )
    mocked_say.assert_called_once_with(text="mocked response", thread_ts=1)


def test_error(mocker):
    mock_request = mocker.Mock()
    mock_request.side_effect = Exception("Error")
    mocker.patch("modules.process_dm_message.make_ai_request", mock_request)
    mock_logger = mocker.Mock()
    mocker.patch("modules.process_dm_message.logger", mock_logger)
    mocked_say = mocker.Mock()
    process_dm_message({}, {"ts": 1, "user": "naomi", "text": "naomi"}, mocked_say)
    mock_request.assert_called_once_with(
        {}, [{"ts": 1, "user": "naomi", "text": "naomi"}]
    )
    mocked_say.assert_called_once_with(
        text="Sorry, I couldn't process your request at the moment.", thread_ts=1
    )
    mock_logger.assert_called_once_with({}, "Error processing DM message: Error")
