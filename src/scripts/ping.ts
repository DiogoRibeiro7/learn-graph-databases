/**
 * Health-check runner for the Neo4j connection.
 *
 * This script verifies that the configured Neo4j instance is reachable and
 * can execute a minimal Cypher query.
 */
import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Entry point for the ping script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    const result = await runQuery(driver, "RETURN 1 AS ok");
    const record = result.records[0];

    if (!record) {
      throw new Error("Ping query returned no records.");
    }

    logger.info("Neo4j ping succeeded", { ok: record.get("ok") });
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to connect to Neo4j.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
