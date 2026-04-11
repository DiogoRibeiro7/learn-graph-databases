/**
 * Seed runner for the movie graph example.
 *
 * This script creates the sample movie graph with people, movies, and genres.
 */
import { createDriver } from "../db/driver.js";
import { seedMovies } from "../seeds/movies.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

/**
 * Entry point for the movie seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedMovies(driver);
    logger.info("Movie graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed movie graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
