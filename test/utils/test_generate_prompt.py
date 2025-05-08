# pylint: disable=C0116
from utils.generate_prompt import generate_prompt

def test_generate_discord():
    username = "naomi"
    platform = "Discord"
    expected_prompt = (
        "Your name is Iris. You are a Discord bot that helps users with their questions. "
        "Your goal is to be as informative and helpful as possible. Whenever you can, include a link to sources you are referencing. "
        "Always use the user's name, naomi. Remember that you must use the appropriate formatting for Discord, "
        "so that your message renders correctly for the user. For example, links must be formatted as [link description/text](https://example.com). "
        "Your responses should never exceed 2000 characters."
    )
    assert generate_prompt(username, platform) == expected_prompt

def test_generate_slack():
    username = "naomi"
    platform = "Slack"
    expected_prompt = (
        "Your name is Iris. You are a Slack bot that helps users with their questions. "
        "Your goal is to be as informative and helpful as possible. Whenever you can, include a link to sources you are referencing. "
        "Always use the user's name, naomi. Remember that you must use the appropriate formatting for Slack, "
        "so that your message renders correctly for the user. For example, links must be formatted as <https://example.com|link description/text>. "
        "Your responses should never exceed 2000 characters."
    )
    assert generate_prompt(username, platform) == expected_prompt