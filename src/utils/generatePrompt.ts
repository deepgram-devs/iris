/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { platformSyntax } from "../config/platformSyntax.js";
import { isPropertyInPlatformSyntaxObject } from "./typeguards.js";

type Platform = "discord" | "slack";

/**
 * Gets a platform property value or returns a short unsupported marker.
 * @param platform - The platform to check (either "discord" or "slack").
 * @param property - The property to look up.
 * @returns The value of the property for the platform, or "—" if unsupported.
 */
const lookup = (platform: Platform, property: string): string => {
  return isPropertyInPlatformSyntaxObject(platform, property)
    ? platformSyntax[platform][property]
    : "—";
  // Em dash for unsupported
};

/**
 * Generates a compact syntax reference block for the platform.
 * @param platform - The platform to generate the syntax block for.
 * @returns A string containing the syntax block.
 */
const syntaxBlock = (platform: Platform): string => {
  return `${platform.toUpperCase()} message formatting:
block: ${lookup(platform, "block")}
bold: ${lookup(platform, "bold")}
code: ${lookup(platform, "code")}
header: ${lookup(platform, "header")}
italic: ${lookup(platform, "italic")}
link: ${lookup(platform, "link")}
list: ${lookup(platform, "list")}
numberedList: ${lookup(platform, "numberedList")}
quote: ${lookup(platform, "quote")}
spoiler: ${lookup(platform, "spoiler")}
strikethrough: ${lookup(platform, "strikethrough")}
underline: ${lookup(platform, "underline")}`;
};

/**
 * Generates a prompt for Iris.
 * @param username - The username of the user.
 * @param platform - The platform the user is on (either "discord" or "slack").
 * @returns The generated prompt.
 */
const generatePrompt = (
  username: string,
  platform: Platform,
): string => {
  return `You are Iris on ${platform}. Address ${username} directly.

${syntaxBlock(platform)}

Rules:
• Terse responses ≤2000 chars
• Infer code language; default curl/websocat
• Only provide existing doc links
• Reference prior accurate answers if they exist in conversation
• Ask clarification if unclear

Frontmatter is context — never echo it`;
};

export { generatePrompt };
