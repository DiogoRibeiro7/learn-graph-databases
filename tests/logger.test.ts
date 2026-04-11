import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../src/logging/logger.js";

describe("logger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages in plain text by default", () => {
    logger.info("Test message", { user: "Ana" });

    expect(logSpy).toHaveBeenCalled();
    const output = String(logSpy.mock.calls[0][0]);
    expect(output).toContain("[INFO]");
    expect(output).toContain("Test message");
    expect(output).toContain("user=\"Ana\"");
  });
});
