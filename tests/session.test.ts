import { beforeEach, describe, expect, it, vi } from "vitest";
import { runQuery } from "../src/db/session.js";

describe("runQuery", () => {
  beforeEach(() => {
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";
    process.env.NEO4J_DATABASE = "neo4j";
  });

  it("runs the query with provided parameters and closes the session", async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    const close = vi.fn().mockResolvedValue(undefined);
    const session = { run, close };
    const driver = { session: vi.fn().mockReturnValue(session) };

    const result = await runQuery(driver as unknown as any, "MATCH (n) RETURN n", { test: 1 });

    expect(driver.session).toHaveBeenCalledWith({ database: expect.any(String) });
    expect(run).toHaveBeenCalledWith("MATCH (n) RETURN n", { test: 1 });
    expect(close).toHaveBeenCalled();
    expect(result).toEqual({ records: [] });
  });

  it("closes the session even when the query throws", async () => {
    const run = vi.fn().mockRejectedValue(new Error("oops"));
    const close = vi.fn().mockResolvedValue(undefined);
    const session = { run, close };
    const driver = { session: vi.fn().mockReturnValue(session) };

    await expect(runQuery(driver as unknown as any, "MATCH (n) RETURN n")).rejects.toThrow("oops");
    expect(close).toHaveBeenCalled();
  });

  it("retries transient Neo4j errors before failing", async () => {
    const transientError = { code: "Neo.TransientError.Transaction.Terminated", message: "Temporary failure" };
    const run = vi.fn()
      .mockRejectedValueOnce(transientError)
      .mockResolvedValue({ records: [] });
    const close = vi.fn().mockResolvedValue(undefined);
    const session = { run, close };
    const driver = { session: vi.fn().mockReturnValue(session) };

    const result = await runQuery(driver as unknown as any, "MATCH (n) RETURN n");

    expect(run).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ records: [] });
    expect(close).toHaveBeenCalled();
  });
});
