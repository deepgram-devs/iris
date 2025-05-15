# pylint: disable=C0116
from modules.append_frontmatter import append_slack_frontmatter

def test_append_slack_frontmatter(mocker):
    mock_app = mocker.Mock()
    mock_app.client.users_info.return_value = {
        "user": {"profile": {"display_name": "test_user"}}
    }
    mock_app.client.conversations_info.return_value = {
        "channel": {"name": "test_channel"}
    }
    message = {
        "text": "<https://example.com|link description/text> <@U08KECNAEP9>",
        "user": "U08KECNAEP9",
        "ts": "1234567890.123456",
        "channel": "C12345678",
    }
    result = append_slack_frontmatter(mock_app, message)
    assert (
        result
        == "---\n"
        "user: test_user\n"
        "date: 2009-02-13 15:33:33.456000\n"
        "channel: test_channel\n"
        "mentions: Yes\n"
        "---\n\n<https://example.com|link description/text> <@U08KECNAEP9>\n"
    )
    mock_app.client.users_info.assert_called_once_with(user="U08KECNAEP9")
    mock_app.client.conversations_info.assert_called_once_with(
        channel="C12345678"
    )
