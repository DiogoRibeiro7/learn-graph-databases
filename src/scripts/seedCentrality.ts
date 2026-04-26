/**
 * Seed runner for the centrality example graph.
 */
import { createDriver } from "../db/driver.js";
import { seedCentrality } from "../seeds/centrality.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedCentrality(driver);
    logger.info("Centrality graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed centrality graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
