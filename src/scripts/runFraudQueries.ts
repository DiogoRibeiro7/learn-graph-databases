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
      customerCount: record.get("customerCount"),
    })));

    const sharedCardsResult = await runQuery(driver, fraudQueries.sharedCreditCards);
    console.log("\n=== Shared Credit Cards ===");
    console.table(sharedCardsResult.records.map((record) => ({
      cardHash: record.get("cardHash"),
      usageCount: record.get("usageCount"),
    })));

    const sharedDeviceResult = await runQuery(driver, fraudQueries.customersSharingDevice);
    console.log("\n=== Customers Sharing Device ===");
    console.table(sharedDeviceResult.records.map((record) => ({
      deviceId: record.get("deviceId"),
      customers: record.get("customers"),
      customerCount: record.get("customerCount"),
    })));

    const ringsResult = await runQuery(driver, fraudQueries.suspiciousTransferRings);
    console.log("\n=== Suspicious Transfer Rings ===");
    console.table(ringsResult.records.map((record) => ({
      anchorAccount: record.get("anchorAccount"),
      cycleLength: record.get("cycleLength"),
      cycleAccounts: record.get("cycleAccounts"),
    })));

    const fanOutResult = await runQuery(driver, fraudQueries.fanOutAccounts, {
      windowStart: "2026-04-01T10:00:00Z",
      windowEnd: "2026-04-01T11:00:00Z",
      minRecipients: 3,
    });
    console.log("\n=== Fan-out Accounts ===");
    console.table(fanOutResult.records.map((record) => ({
      sourceAccount: record.get("sourceAccount"),
      recipients: record.get("recipients"),
      transferCount: record.get("transferCount"),
      totalOut: record.get("totalOut"),
    })));

    const velocityResult = await runQuery(driver, fraudQueries.highVelocityCards, {
      minOrders: 3,
      maxSeconds: 1800,
    });
    console.log("\n=== High-Velocity Cards ===");
    console.table(velocityResult.records.map((record) => ({
      cardHash: record.get("cardHash"),
      orderCount: record.get("orderCount"),
      firstSeen: record.get("firstSeen"),
      lastSeen: record.get("lastSeen"),
      spanSeconds: record.get("spanSeconds"),
    })));

    try {
      const communityResult = await runQuery(driver, fraudQueries.communityDetection);
      console.log("\n=== Fraud Community Detection ===");
      console.table(communityResult.records.map((record) => ({
        componentId: record.get("componentId"),
        customer: record.get("customer"),
      })));
    } catch (error: unknown) {
      logger.warn("Skipping community detection query (GDS may be unavailable).", {
        error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
      });
    }
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
