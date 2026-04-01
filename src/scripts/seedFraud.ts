import { createDriver } from "../db/driver.js";
import { seedFraud } from "../seeds/fraud.js";

/**
 * Seeds the fraud graph example.
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
  console.error(error);
  process.exitCode = 1;
});
