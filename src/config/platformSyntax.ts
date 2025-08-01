/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

export const platformSyntax = {
  discord: {
    block:         "```lang\ncode block\n```",
    bold:          "**bold**",
    code:          "`code`",
    header:        "# H1, ## H2, ### H3",
    italic:        "_italic_",
    link:          "[link](https://url)",
    list:          "- item 1\n- item 2",
    numberedList:  "1. item 1\n2. item 2",
    quote:         "> quote",
    spoiler:       "||spoiler||",
    strikethrough: "~~strikethrough~~",
    underline:     "__underline__",
  },
  slack: {
    block:         "```\ncode block\n```",
    bold:          "*bold*",
    code:          "`code`",
    italic:        "_italic_",
    link:          "<https://url|link>",
    list:          "- item 1\n- item 2",
    numberedList:  "1. item 1\n2. item 2",
    quote:         "> quote",
    strikethrough: "~strikethrough~",
  },
};
