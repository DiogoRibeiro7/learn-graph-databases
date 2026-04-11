import { createDriver } from "../db/driver.js";
import { seedSupplyChain } from "../seeds/supplyChain.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Seeds the supply-chain graph example.
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
