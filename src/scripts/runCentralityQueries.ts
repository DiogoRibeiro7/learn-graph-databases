import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { centralityQueries } from "../db/queries.js";
import type { CentralityProjectionParams } from "../db/queryModules/centrality.js";

async function main(): Promise<void> {
  const driver = createDriver();
  const graphName = `centralityGraph_${Date.now()}`;
  const params: CentralityProjectionParams = { graphName };

  try {
    logger.info("Running centrality example queries.", { graphName });

    await runQuery(driver, centralityQueries.projectGraph, params);

    const pageRankResult = await runQuery(driver, centralityQueries.pageRank, params);
    console.log("\n=== PageRank (Influencers) ===");
    console.table(pageRankResult.records.map((record) => ({
      person: record.get("person"),
      score: record.get("score"),
    })));

    const betweennessResult = await runQuery(driver, centralityQueries.betweenness, params);
    console.log("\n=== Betweenness (Critical Connectors) ===");
    console.table(betweennessResult.records.map((record) => ({
      person: record.get("person"),
      score: record.get("score"),
    })));

    const degreeResult = await runQuery(driver, centralityQueries.degree, params);
    console.log("\n=== Degree (Local Hubs) ===");
    console.table(degreeResult.records.map((record) => ({
      person: record.get("person"),
      score: record.get("score"),
    })));
  } finally {
    try {
      await runQuery(driver, centralityQueries.dropGraph, params);
    } catch (error: unknown) {
      logger.warn("Failed to drop centrality graph projection (may not exist).", {
        graphName,
        error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
      });
    }

    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run centrality example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
