import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";

/**
 * Simple connectivity check for the local Neo4j instance.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    const result = await runQuery(driver, "RETURN 1 AS ok");
    const record = result.records[0];

    if (!record) {
      throw new Error("Ping query returned no records.");
    }

    console.log("Connected to Neo4j. Result:", record.get("ok"));
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to connect to Neo4j.");
  console.error(error);
  process.exitCode = 1;
});
