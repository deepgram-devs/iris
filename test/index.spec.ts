/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */

import { describe, it, expect } from "vitest";

describe("example test", () => {
  it("should pass", () => {
    expect.assertions(1);
    expect(true, "example message").toBeTruthy();
  });
});
