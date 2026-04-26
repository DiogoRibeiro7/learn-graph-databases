/**
 * Seed runner for the knowledge graph example.
 */
import { createDriver } from "../db/driver.js";
import { seedKnowledgeGraph } from "../seeds/knowledgeGraph.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedKnowledgeGraph(driver);
    logger.info("Knowledge graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  logger.error("Failed to seed knowledge graph.", {
    error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
  });
  process.exitCode = 1;
});
