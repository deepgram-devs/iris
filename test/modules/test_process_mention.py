# pylint: disable=C0116
from modules.process_mention import process_mention


def test_success(mocker):
    mock_frontmatter = mocker.Mock()
    mock_frontmatter.return_value = "---\nuser: naomi\ndate: 2009-02-13 15:33:33.456000\nchannel: test_channel\nmentions: Yes\n---\n\nnaomi\n"
    mocker.patch(
        "modules.append_frontmatter.append_slack_frontmatter", mock_frontmatter
    )
    mock_request = mocker.Mock()
    mock_request.return_value = "mocked response"
    mocker.patch("modules.process_mention.make_ai_request", mock_request)
    mocked_say = mocker.Mock()
    mock_user_request = mocker.Mock()
    mock_user_request.return_value = {"user": {"profile": {"display_name": "naomi"}}}
    mock_client = mocker.Mock(client=mocker.Mock(users_info=mock_user_request))
    process_mention(
        mock_client, {"ts": 1, "user": "naomi", "text": "naomi"}, mocked_say
    )
    mock_request.assert_called_once_with(
        mock_client, [{"ts": 1, "user": "naomi", "text": "naomi"}], "naomi", "Slack"
    )
    mocked_say.assert_called_once_with(text="mocked response", thread_ts=1)


def test_error(mocker):
    mock_frontmatter = mocker.Mock()
    mock_frontmatter.return_value = "---\nuser: naomi\ndate: 2009-02-13 15:33:33.456000\nchannel: test_channel\nmentions: Yes\n---\n\nnaomi\n"
    mocker.patch(
        "modules.append_frontmatter.append_slack_frontmatter", mock_frontmatter
    )
    mock_request = mocker.Mock()
    mock_request.side_effect = Exception("Error")
    mocker.patch("modules.process_mention.make_ai_request", mock_request)
    mock_logger = mocker.Mock()
    mocker.patch("modules.process_mention.logger", mock_logger)
    mocked_say = mocker.Mock()
    mock_user_request = mocker.Mock()
    mock_user_request.return_value = {"user": {"profile": {"display_name": "naomi"}}}
    mock_client = mocker.Mock(client=mocker.Mock(users_info=mock_user_request))
    process_mention(
        mock_client, {"ts": 1, "user": "naomi", "text": "naomi"}, mocked_say
    )
    mock_request.assert_called_once_with(
        mock_client, [{"ts": 1, "user": "naomi", "text": "naomi"}], "naomi", "Slack"
    )
    mocked_say.assert_called_once_with(
        text="Sorry, I couldn't process your request at the moment.", thread_ts=1
    )
    mock_logger.assert_called_with(mock_client, "Error processing mention: Error")
