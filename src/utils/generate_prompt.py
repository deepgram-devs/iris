from config.platform_syntax import platform_syntax

def get_platform_syntax(platform):
    """
    Retrieves the syntax for the specified platform.

    Args:
        platform (str): The platform name (MUST BE ONE OF "Slack", "Discord").

    Returns:
        str: A prompt containing the syntax for the specified platform.
    """
    return (
        f"Syntax for {platform}:\n"
        f"Links: {platform_syntax[platform].get('links', "Unsupported on this platform.")}\n"
        f"Bold: {platform_syntax[platform].get('bold', 'Unsupported on this platform.')}\n"
        f"Italic: {platform_syntax[platform].get('italic', 'Unsupported on this platform.')}\n"
        f"Code: {platform_syntax[platform].get('code', 'Unsupported on this platform.')}\n"
        f"Code Block: {platform_syntax[platform].get('code_block', 'Unsupported on this platform.')}\n"
        f"List: {platform_syntax[platform].get('list', 'Unsupported on this platform.')}\n"
        f"Numbered List: {platform_syntax[platform].get('numbered_list', 'Unsupported on this platform.')}\n"
        f"Quote: {platform_syntax[platform].get('quote', 'Unsupported on this platform.')}\n"
        f"Strikethrough: {platform_syntax[platform].get('strikethrough', 'Unsupported on this platform.')}\n"
        f"Underline: {platform_syntax[platform].get('underline', 'Unsupported on this platform.')}\n"
        f"Spoiler: {platform_syntax[platform].get('spoiler', 'Unsupported on this platform.')}\n"
        f"Header: {platform_syntax[platform].get('header', 'Unsupported on this platform.')}\n"
        f"Remember to use the appropriate formatting for {platform} so that your message renders correctly for the user."
    )

def generate_prompt(username, platform):
    """
    Generates a system message for the AI model based on the platform and username.

    Args:
        username (str): The username of the user.
        platform (str): The platform name (MUST BE ONE OF "Slack", "Discord").

    Returns:
        str: The generated system message.
    """
    return (
        f"Your name is Iris. You are a {platform} bot that helps users with their questions. "
        f"You should behave as an AI colleague. Your focus is to guide the user toward finding their own answers, rather than providing clear and direct information. "
        f"Whenever possible, include a link to sources you are referencing. Make sure that the link is valid and accessible. "
        f"If the user asks you for additional information, or has more questions about the same topic, THEN you can provide a more detailed answer. "
        f"Unless the user explicitly mentions or requests a specific code language, you should default to CURL for HTTP requests and Python for websocket requests. "
        f"Always use the user's name, {username}. "
        f"{get_platform_syntax(platform)} "
        "Your responses should never exceed 2000 characters."
    )