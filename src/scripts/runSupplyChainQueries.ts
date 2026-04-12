import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { supplyChainQueries } from "../db/queries.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running supply chain example queries.");

    const flowResult = await runQuery(driver, supplyChainQueries.supplierComponentFlow);
    console.log("\n=== Supplier-Component-Factory Flow ===");
    console.table(flowResult.records.map((record) => ({
      supplier: record.get("supplier"),
      component: record.get("component"),
      factory: record.get("factory"),
    })));

    const pathResult = await runQuery(driver, supplyChainQueries.supplierShortestPath);
    console.log("\n=== Supplier Shortest Path ===");
    console.table(pathResult.records.map((record) => ({
      path: record.get("p"),
      hops: record.get("hops"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run supply chain example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
