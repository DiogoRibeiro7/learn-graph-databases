/**
 * Seed runner for the ontology-driven example graph.
 */
import { createDriver } from "../db/driver.js";
import { seedOntology } from "../seeds/ontology.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedOntology(driver);
    logger.info("Ontology graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed ontology graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
