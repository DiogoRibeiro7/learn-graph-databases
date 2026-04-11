/**
 * Seed runner for the fraud graph example.
 *
 * This script creates the sample fraud detection graph with customers,
 * orders, credit cards, and shared identifiers.
 */
import { createDriver } from "../db/driver.js";
import { seedFraud } from "../seeds/fraud.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";

/**
 * Entry point for the fraud seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedFraud(driver);
    console.log("Fraud graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to seed fraud graph.");
  console.error(error instanceof Error ? formatNeo4jErrorMessage(error) : error);
  process.exitCode = 1;
});
