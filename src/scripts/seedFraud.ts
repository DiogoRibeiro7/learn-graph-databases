/**
 * Seed runner for the fraud graph example.
 *
 * This script creates the sample fraud detection graph with customers,
 * orders, credit cards, and shared identifiers.
 */
import { createDriver } from "../db/driver.js";
import { seedFraud } from "../seeds/fraud.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Entry point for the fraud seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedFraud(driver);
    logger.info("Fraud graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed fraud graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
