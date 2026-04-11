import type { Driver, QueryResult, Session } from "neo4j-driver";
import { getConfig } from "../config/env.js";
import { logger } from "../logging/logger.js";
import { formatNeo4jErrorMessage, isRetryableNeo4jError } from "./errors.js";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 150;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function summarizeQuery(cypher: string): string {
  return cypher.replace(/\s+/g, " ").trim().slice(0, 120);
}

/**
 * Query parameters passed to Neo4j session execution.
 */
export type QueryParameters = Readonly<Record<string, unknown>>;

/**
 * Runs a read or write Cypher query and returns the raw Neo4j result.
 *
 * This helper centralises session management so example scripts stay short.
 *
 * @param driver - Active Neo4j driver.
 * @param cypher - Cypher query string.
 * @param parameters - Query parameters.
 * @returns Raw Neo4j query result.
 */
export async function runQuery(
  driver: Driver,
  cypher: string,
  parameters: Record<string, unknown> = {},
): Promise<QueryResult> {
  const cfg = getConfig();
  const session: Session = driver.session({ database: cfg.database });

  const querySummary = summarizeQuery(cypher);
  const startTime = Date.now();

  try {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        const result = await session.run(cypher, parameters);
        const durationMs = Date.now() - startTime;

        logger.info("Executed Neo4j query", {
          query: querySummary,
          parameters,
          durationMs,
          database: cfg.database,
          records: result.records.length,
          attempt,
        });

        return result;
      } catch (error: unknown) {
        const durationMs = Date.now() - startTime;
        logger.error("Neo4j query failed", {
          query: querySummary,
          parameters,
          durationMs,
          attempt,
          error: error instanceof Error ? error.message : String(error),
        });

        if (attempt < MAX_RETRIES && isRetryableNeo4jError(error)) {
          await delay(RETRY_DELAY_MS);
          continue;
        }

        throw new Error(formatNeo4jErrorMessage(error), { cause: error });
      }
    }

    throw new Error("Neo4j query failed after retry attempts.");
  } finally {
    await session.close();
  }
}
