import { createDriver } from "../db/driver.js";
import { seedSupplyChain } from "../seeds/supplyChain.js";

/**
 * Seeds the supply-chain graph example.
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
