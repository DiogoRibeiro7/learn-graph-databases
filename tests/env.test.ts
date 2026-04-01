import { describe, expect, it, vi } from "vitest";

describe("getConfig", () => {
  it("throws when required variables are missing", async () => {
    vi.resetModules();
    delete process.env.NEO4J_URI;
    delete process.env.NEO4J_USERNAME;
    delete process.env.NEO4J_PASSWORD;
    delete process.env.NEO4J_DATABASE;

    const mod = await import("../src/config/env.js");

    expect(() => mod.getConfig()).toThrowError(/NEO4J_URI/);
  });

  it("returns configuration when variables are present", async () => {
    vi.resetModules();
    process.env.NEO4J_URI = "bolt://localhost:7687";
    process.env.NEO4J_USERNAME = "neo4j";
    process.env.NEO4J_PASSWORD = "secret";
    process.env.NEO4J_DATABASE = "neo4j";

    const mod = await import("../src/config/env.js");

    expect(mod.getConfig()).toEqual({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "secret",
      database: "neo4j",
    });
  });
});
