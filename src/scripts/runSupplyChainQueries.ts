import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { supplyChainQueries } from "../db/queries.js";
import { mapSupplierComponentFlowRows } from "../db/queryModules/supplyChain.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running supply chain example queries.");

    const flowResult = await runQuery(driver, supplyChainQueries.supplierComponentFlow);
    console.log("\n=== Supplier-Component-Factory Flow ===");
    console.table(mapSupplierComponentFlowRows(flowResult.records));

    const pathResult = await runQuery(driver, supplyChainQueries.supplierShortestPath);
    console.log("\n=== Supplier Shortest Path ===");
    console.table(pathResult.records.map((record) => ({
      path: record.get("p"),
      hops: record.get("hops"),
    })));

    const singleSourceResult = await runQuery(driver, supplyChainQueries.singleSourceComponents);
    console.log("\n=== Single-Source Components ===");
    console.table(singleSourceResult.records.map((record) => ({
      component: record.get("component"),
      soleSupplier: record.get("soleSupplier"),
      supplierRisk: record.get("supplierRisk"),
    })));

    const factoryRiskResult = await runQuery(driver, supplyChainQueries.factorySinglePointDependencies);
    console.log("\n=== Factory Single-Point Dependencies ===");
    console.table(factoryRiskResult.records.map((record) => ({
      factory: record.get("factory"),
      component: record.get("component"),
      soleSupplier: record.get("soleSupplier"),
      riskScore: record.get("riskScore"),
      region: record.get("region"),
    })));

    const multiTierResult = await runQuery(driver, supplyChainQueries.multiTierExposure);
    console.log("\n=== Multi-tier Exposure ===");
    console.table(multiTierResult.records.map((record) => ({
      factory: record.get("factory"),
      component: record.get("component"),
      upstreamSupplier: record.get("upstreamSupplier"),
      supplierTier: record.get("supplierTier"),
      riskScore: record.get("riskScore"),
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
