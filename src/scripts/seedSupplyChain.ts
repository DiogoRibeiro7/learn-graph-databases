/**
 * Seed runner for the supply chain graph example.
 *
 * This script creates the sample supply-chain graph with suppliers,
 * components, and factory usage relationships.
 */
import { createDriver } from "../db/driver.js";
import { seedSupplyChain } from "../seeds/supplyChain.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Entry point for the supply chain seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedSupplyChain(driver);
    logger.info("Supply-chain graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed supply-chain graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
