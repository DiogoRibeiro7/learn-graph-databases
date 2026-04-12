import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { fraudQueries } from "../db/queries.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running fraud example queries.");

    const sharedIpResult = await runQuery(driver, fraudQueries.customersSharingIp);
    console.log("\n=== Customers Sharing IP ===");
    console.table(sharedIpResult.records.map((record) => ({
      ip: record.get("ip"),
      customers: record.get("customers"),
    })));

    const sharedCardsResult = await runQuery(driver, fraudQueries.sharedCreditCards);
    console.log("\n=== Shared Credit Cards ===");
    console.table(sharedCardsResult.records.map((record) => ({
      cardHash: record.get("cardHash"),
    })));

    const communityResult = await runQuery(driver, fraudQueries.communityDetection);
    console.log("\n=== Fraud Community Detection ===");
    console.table(communityResult.records.map((record) => ({
      componentId: record.get("componentId"),
      customer: record.get("customer"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run fraud example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
