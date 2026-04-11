/**
 * Seed runner for the movie graph example.
 *
 * This script creates the sample movie graph with people, movies, and genres.
 */
import { createDriver } from "../db/driver.js";
import { seedMovies } from "../seeds/movies.js";

/**
 * Entry point for the movie seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedMovies(driver);
    console.log("Movie graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to seed movie graph.");
  console.error(error);
  process.exitCode = 1;
});
