import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { rbacQueries } from "../db/queries.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running RBAC example queries.");

    const canAccessResult = await runQuery(driver, rbacQueries.canUserAccessResource, {
      userId: "U002",
      resourceId: "RES-REPORTS",
    });
    console.log("\n=== Can User Access Resource ===");
    console.table(canAccessResult.records.map((record) => ({
      userId: record.get("userId"),
      resourceId: record.get("resourceId"),
      canAccess: record.get("canAccess"),
    })));

    const userActionsOnResource = await runQuery(driver, rbacQueries.userActionsOnResource, {
      userId: "U002",
      resourceId: "RES-REPORTS",
    });
    console.log("\n=== User Actions On Resource ===");
    console.table(userActionsOnResource.records.map((record) => ({
      resource: record.get("resource"),
      allowedActions: record.get("allowedActions"),
    })));

    const userCapabilities = await runQuery(driver, rbacQueries.userCapabilities, {
      userId: "U002",
    });
    console.log("\n=== What Can User Do ===");
    console.table(userCapabilities.records.map((record) => ({
      resource: record.get("resource"),
      allowedActions: record.get("allowedActions"),
    })));

    const explainability = await runQuery(driver, rbacQueries.explainUserAccessPath, {
      userId: "U002",
      resourceId: "RES-REPORTS",
    });
    console.log("\n=== Access Grant Paths ===");
    console.table(explainability.records.map((record) => ({
      grantPath: record.get("grantPath"),
      action: record.get("action"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run RBAC example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
