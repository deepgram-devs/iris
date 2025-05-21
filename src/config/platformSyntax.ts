/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

export const platformSyntax = {
  discord: {
    bold:          "**bold text**",
    code:          "`code`",
    codeBlock:     "```\ncode block\n```",
    // eslint-disable-next-line stylistic/max-len -- Long string.
    header:        "# Top Level Header\n## Second Level Header\n### Third Level Header",
    italic:        "_italic text_",
    links:         "[link description/text](https://example.com)",
    list:          "- item 1\n- item 2",
    numberedList:  "1. item 1\n2. item 2",
    quote:         "> This is a quote",
    spoiler:       "||spoiler||",
    strikethrough: "~~strikethrough~~",
    underline:     "__underline__",
  },
  slack: {
    // eslint-disable-next-line stylistic/max-len -- Long string.
    bold:          "*bold text* - DO NOT USE TWO ASTERISKS SLACK WILL NOT RENDER IT",
    code:          "`code`",
    codeBlock:     "```\ncode block\n```",
    italic:        "_italic text_",
    links:         "<https://example.com|link description/text>",
    list:          "- item 1\n- item 2",
    numberedList:  "1. item 1\n2. item 2",
    quote:         "> This is a quote",
    strikethrough: "~strikethrough~",
  },
};
