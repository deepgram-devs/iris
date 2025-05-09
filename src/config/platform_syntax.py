"""
  This module contains an object that maps different platforms to their respective link syntax.
  Use this to help the AI understand the markdown discrepancies between platforms.
"""
platform_syntax = {
    "Slack": {
        "links": "<https://example.com|link description/text>",
        "bold": "*bold text* - DO NOT USE TWO ASTERISKS SLACK WILL NOT RENDER IT",
        "italic": "_italic text_",
        "code": "`code`",
        "code_block": "```\ncode block\n```",
        "list": "- item 1\n- item 2",
        "numbered_list": "1. item 1\n2. item 2",
        "quote": "> This is a quote",
        "strikethrough": "~strikethrough~",
    },
    "Discord": {
        "links": "[link description/text](https://example.com)",
        "bold": "**bold text**",
        "italic": "_italic text_",
        "code": "`code`",
        "code_block": "```\ncode block\n```",
        "list": "- item 1\n- item 2",
        "numbered_list": "1. item 1\n2. item 2",
        "quote": "> This is a quote",
        "strikethrough": "~~strikethrough~~",
        "underline": "__underline__",
        "spoiler": "||spoiler||",
        "header": "# Top Level Header\n## Second Level Header\n### Third Level Header",
    }
}
