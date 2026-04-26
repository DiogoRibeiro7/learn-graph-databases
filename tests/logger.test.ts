import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadLogger() {
  vi.resetModules();
  return import("../src/logging/logger.js");
}

describe("logger", () => {
  beforeEach(() => {
    delete process.env.LOG_FORMAT;
    delete process.env.LOG_LEVEL;
    delete process.env.LOG_SERVICE;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages in plain text by default", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger();

    logger.info("Test message", { user: "Ana" });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = String(logSpy.mock.calls[0]?.[0]);
    expect(output).toContain("[INFO]");
    expect(output).toContain("Test message");
    expect(output).toContain("service=\"learn-graph-databases\"");
    expect(output).toContain("user=\"Ana\"");
  });

  it("emits JSON payloads when LOG_FORMAT=json", async () => {
    process.env.LOG_FORMAT = "json";
    process.env.LOG_LEVEL = "debug";
    process.env.LOG_SERVICE = "test-service";

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger();

    logger.debug("Debug message", { requestId: "req-1" });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(String(logSpy.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(output.level).toBe("debug");
    expect(output.message).toBe("Debug message");
    expect(output.service).toBe("test-service");
    expect(output.requestId).toBe("req-1");
    expect(output).toHaveProperty("timestamp");
    expect(output).toHaveProperty("pid");
  });

  it("supports child logger bindings", async () => {
    process.env.LOG_FORMAT = "json";

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger();
    const requestLogger = logger.child({ requestId: "req-42", component: "api" });

    requestLogger.info("Request received");

    const output = JSON.parse(String(logSpy.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(output.requestId).toBe("req-42");
    expect(output.component).toBe("api");
  });

  it("filters debug logs when LOG_LEVEL=info", async () => {
    process.env.LOG_LEVEL = "info";

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger();

    logger.debug("hidden");
    logger.info("visible");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(String(logSpy.mock.calls[0]?.[0])).toContain("visible");
  });
});
