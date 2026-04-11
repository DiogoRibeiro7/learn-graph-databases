/**
 * Seed runner for the supply chain graph example.
 *
 * This script creates the sample supply-chain graph with suppliers,
 * components, and factory usage relationships.
 */
import { createDriver } from "../db/driver.js";
import { seedSupplyChain } from "../seeds/supplyChain.js";

/**
 * Entry point for the supply chain seed script.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    await seedSupplyChain(driver);
    console.log("Supply-chain graph seeded successfully.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to seed supply-chain graph.");
  console.error(error);
  process.exitCode = 1;
});
