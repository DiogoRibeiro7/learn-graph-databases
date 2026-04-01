import { createDriver } from "../db/driver.js";
import { seedMovies } from "../seeds/movies.js";

/**
 * Seeds the movie graph example.
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
