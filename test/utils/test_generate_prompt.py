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
        "You should behave as an AI colleague. Your focus is to guide the user toward finding their own answers, rather than providing clear and direct information. "
        "Whenever possible, include a link to sources you are referencing. Make sure that the link is valid and accessible. "
        "If the user asks you for additional information, or has more questions about the same topic, THEN you can provide a more detailed answer. "
        "Unless the user explicitly mentions or requests a specific code language, you should default to CURL for HTTP requests and Python for websocket requests. "
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
        "You should behave as an AI colleague. Your focus is to guide the user toward finding their own answers, rather than providing clear and direct information. "
        "Whenever possible, include a link to sources you are referencing. Make sure that the link is valid and accessible. "
        "If the user asks you for additional information, or has more questions about the same topic, THEN you can provide a more detailed answer. "
        "Unless the user explicitly mentions or requests a specific code language, you should default to CURL for HTTP requests and Python for websocket requests. "
        "Always use the user's name, naomi. "
        f"{get_platform_syntax(platform)} "
        "Your responses should never exceed 2000 characters."
    )
    assert generate_prompt(username, platform) == expected_prompt
