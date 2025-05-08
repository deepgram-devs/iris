from utils.generate_prompt import generate_prompt, get_platform_syntax


def test_get_discord_syntax():
    platform = "Discord"
    expected_syntax = (
        f"Syntax for {platform}:\n"
        "Links: [link description/text](https://example.com)\n"
        "Bold: **bold text**\n"
        "Italic: _italic text_\n"
        "Code: `code`\n"
        "Code Block: ```\ncode block\n```\n"
        "List: - item 1\n- item 2\n"
        "Numbered List: 1. item 1\n2. item 2\n"
        "Quote: > This is a quote\n"
        "Strikethrough: ~~strikethrough~~\n"
        "Underline: __underline__\n"
        "Spoiler: ||spoiler||\n"
        "Header: # Top Level Header\n## Second Level Header\n### Third Level Header\n"
        # pylint: disable=C0301
        "Remember to use the appropriate formatting for Discord so that your message renders correctly for the user."
    )
    assert get_platform_syntax(platform) == expected_syntax


def test_get_slack_syntax():
    platform = "Slack"
    expected_syntax = (
        f"Syntax for {platform}:\n"
        "Links: <https://example.com|link description/text>\n"
        "Bold: *bold text*\n"
        "Italic: _italic text_\n"
        "Code: `code`\n"
        "Code Block: ```\ncode block\n```\n"
        "List: - item 1\n- item 2\n"
        "Numbered List: 1. item 1\n2. item 2\n"
        "Quote: > This is a quote\n"
        "Strikethrough: ~strikethrough~\n"
        "Underline: Unsupported on this platform.\n"
        "Spoiler: Unsupported on this platform.\n"
        "Header: Unsupported on this platform.\n"
        # pylint: disable=C0301
        "Remember to use the appropriate formatting for Slack so that your message renders correctly for the user."
    )
    assert get_platform_syntax(platform) == expected_syntax


def test_generate_discord():
    username = "naomi"
    platform = "Discord"
    expected_prompt = (
        "Your name is Iris. You are a Discord bot that helps users with their questions. "
        "Your goal is to be as informative and helpful as possible. Whenever you can, include a link to sources you are referencing. "
        "Always use the user's name, naomi. "
        f"{get_platform_syntax(platform)} "
        "Your responses should never exceed 2000 characters."
    )
    assert generate_prompt(username, platform) == expected_prompt


def test_generate_slack():
    username = "naomi"
    platform = "Slack"
    expected_prompt = (
        "Your name is Iris. You are a Slack bot that helps users with their questions. "
        "Your goal is to be as informative and helpful as possible. Whenever you can, include a link to sources you are referencing. "
        "Always use the user's name, naomi. "
        f"{get_platform_syntax(platform)} "
        "Your responses should never exceed 2000 characters."
    )
    assert generate_prompt(username, platform) == expected_prompt
