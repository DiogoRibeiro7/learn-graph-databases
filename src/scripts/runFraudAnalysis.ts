import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { fraudQueries } from "../db/queries.js";

function printSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running fraud analysis workflow.");

    const fanOutResult = await runQuery(driver, fraudQueries.fanOutAccounts, {
      windowStart: "2026-04-01T10:00:00Z",
      windowEnd: "2026-04-01T11:00:00Z",
      minRecipients: 3,
    });
    printSection("Fan-out Detection");
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
    printSection("Card Velocity Detection");
    console.table(velocityResult.records.map((record) => ({
      cardHash: record.get("cardHash"),
      orderCount: record.get("orderCount"),
      firstSeen: record.get("firstSeen"),
      lastSeen: record.get("lastSeen"),
      spanSeconds: record.get("spanSeconds"),
    })));

    const ringsResult = await runQuery(driver, fraudQueries.suspiciousTransferRings);
    printSection("Transfer Ring Detection");
    console.table(ringsResult.records.map((record) => ({
      anchorAccount: record.get("anchorAccount"),
      cycleLength: record.get("cycleLength"),
      cycleAccounts: record.get("cycleAccounts"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Fraud analysis workflow failed.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
