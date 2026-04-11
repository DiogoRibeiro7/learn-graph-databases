import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { config as loadEnv } from "dotenv";
import { createDriver } from "../src/db/driver.js";
import { runQuery } from "../src/db/session.js";

loadEnv();

const hasNeo4jConfig =
  typeof process.env.NEO4J_URI === "string" &&
  typeof process.env.NEO4J_USERNAME === "string" &&
  typeof process.env.NEO4J_PASSWORD === "string" &&
  typeof process.env.NEO4J_DATABASE === "string";

const describeIfNeo4j = hasNeo4jConfig ? describe : describe.skip;

describeIfNeo4j("Neo4j integration tests", () => {
  let driver: Awaited<ReturnType<typeof createDriver>>;
  const uniqueKey = `test-integration-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  beforeAll(() => {
    driver = createDriver();
  });

  afterAll(async () => {
    await driver.close();
  });

  it("connects to Neo4j and returns a basic query result", async () => {
    const result = await runQuery(driver, "RETURN 1 AS ok");

    expect(result.records).toHaveLength(1);
    expect(result.records[0].get("ok")).toBe(1);
  });

  it("creates and removes a temporary test node", async () => {
    const createResult = await runQuery(
      driver,
      "CREATE (t:TestIntegration {key: $key}) RETURN t.key AS key",
      { key: uniqueKey },
    );

    expect(createResult.records[0].get("key")).toBe(uniqueKey);

    const cleanupResult = await runQuery(
      driver,
      "MATCH (t:TestIntegration {key: $key}) WITH count(t) AS deletedCount, collect(t) AS nodes DETACH DELETE nodes RETURN deletedCount",
      { key: uniqueKey },
    );

    expect(cleanupResult.records[0].get("deletedCount")).toBe(1);
  });
});
