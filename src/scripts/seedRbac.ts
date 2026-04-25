/**
 * Seed runner for the RBAC graph example.
 */
import { createDriver } from "../db/driver.js";
import { seedRbac } from "../seeds/rbac.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedRbac(driver);
    logger.info("RBAC graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed RBAC graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
