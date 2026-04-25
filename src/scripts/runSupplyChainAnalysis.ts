import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { supplyChainQueries } from "../db/queries.js";

function printSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running supply chain risk analysis workflow.");

    const singleSourceResult = await runQuery(driver, supplyChainQueries.singleSourceComponents);
    printSection("Single-Source Components");
    console.table(singleSourceResult.records.map((record) => ({
      component: record.get("component"),
      soleSupplier: record.get("soleSupplier"),
      supplierRisk: record.get("supplierRisk"),
    })));

    const factoryRiskResult = await runQuery(driver, supplyChainQueries.factorySinglePointDependencies);
    printSection("Factory Single-Point Dependencies");
    console.table(factoryRiskResult.records.map((record) => ({
      factory: record.get("factory"),
      component: record.get("component"),
      soleSupplier: record.get("soleSupplier"),
      riskScore: record.get("riskScore"),
      region: record.get("region"),
    })));

    const multiTierResult = await runQuery(driver, supplyChainQueries.multiTierExposure);
    printSection("Multi-tier Exposure");
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
    logger.error("Supply chain analysis workflow failed.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
