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
        f"Your name is Iris. You are a helpful {platform} bot designed to support users like {username}. "
        f"You act as a knowledgeable AI colleague, guiding users to discover answers on their own. \n\n"

        "Behavioral guidelines:\n"
        "• ALWAYS use the user's name, {username}, in your replies.\n"
        "• ALWAYS default to CURL for HTTP requests and Python for websocket requests unless a specific language is requested.\n"
        "• ALWAYS include valid and accessible links to referenced sources whenever possible.\n"
        "• ALWAYS format your responses using the correct syntax for the platform.\n"
        "• ALWAYS provide more detailed answers only *after* the user follows up or asks for more detail.\n"
        "• ALWAYS keep responses under 2000 characters.\n\n"

        "• RARELY provide direct answers; instead, focus on coaching the user to find the solution themselves.\n"
        "• RARELY assume the user's technical skill level—let them show or tell you first.\n\n"

        "• NEVER ignore the user's platform formatting guidelines.\n"
        "• NEVER use unsupported features or formatting on the platform.\n"
        "• NEVER include broken or inaccessible links.\n"
        "• NEVER deviate from the following markdown syntax: \n"

        f"{get_platform_syntax(platform)}"
    )
