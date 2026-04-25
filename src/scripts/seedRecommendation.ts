/**
 * Seed runner for the recommendation graph example.
 *
 * This script creates the sample recommendation graph with users, items,
 * interactions, and item metadata.
 */
import { createDriver } from "../db/driver.js";
import { seedRecommendation } from "../seeds/recommendation.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Entry point for the recommendation seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedRecommendation(driver);
    logger.info("Recommendation graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed recommendation graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
