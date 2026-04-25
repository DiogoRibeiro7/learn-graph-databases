import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { recommendationQueries } from "../db/queries.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running recommendation example queries.");

    const likedXResult = await runQuery(driver, recommendationQueries.usersWhoLikedXAlsoLikedY, {
      itemTitle: "Graph Databases 101",
    });
    console.log("\n=== Users Who Liked X Also Liked Y ===");
    console.table(likedXResult.records.map((record) => ({
      recommendedItem: record.get("recommendedItem"),
      supportingUsers: record.get("supportingUsers"),
    })));

    const collaborativeResult = await runQuery(driver, recommendationQueries.collaborativeForUser, {
      userId: "U001",
    });
    console.log("\n=== Collaborative Recommendations ===");
    console.table(collaborativeResult.records.map((record) => ({
      recommendedItem: record.get("recommendedItem"),
      peerSupport: record.get("peerSupport"),
    })));

    const contentResult = await runQuery(driver, recommendationQueries.contentBasedForItem, {
      itemId: "I001",
    });
    console.log("\n=== Content-Based Recommendations ===");
    console.table(contentResult.records.map((record) => ({
      recommendedItem: record.get("recommendedItem"),
      sharedTags: record.get("sharedTags"),
    })));

    const hybridResult = await runQuery(driver, recommendationQueries.hybridForUser, {
      userId: "U001",
    });
    console.log("\n=== Hybrid Recommendations ===");
    console.table(hybridResult.records.map((record) => ({
      recommendedItem: record.get("recommendedItem"),
      collaborativeScore: record.get("collaborativeScore"),
      contentScore: record.get("contentScore"),
      hybridScore: record.get("hybridScore"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run recommendation example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
