/**
 * Neo4j session and query helpers.
 *
 * This module centralises session lifecycle management for scripts and
 * seed loaders, ensuring the configured database is always used.
 */
import type { Driver, QueryResult, Session } from "neo4j-driver";
import { getConfig } from "../config/env.js";
import { formatNeo4jErrorMessage, isRetryableNeo4jError } from "./errors.js";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 150;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Query parameters passed to Neo4j session execution.
 */
export type QueryParameters = Readonly<Record<string, unknown>>;

/**
 * Runs a read or write Cypher query and returns the raw Neo4j result.
 *
 * This helper centralises session management so example scripts stay short
 * and provides retry behavior for transient Neo4j errors.
 *
 * @param driver - Active Neo4j driver.
 * @param cypher - Cypher query string.
 * @param parameters - Query parameters.
 * @returns Raw Neo4j query result.
 */
export async function runQuery(
  driver: Driver,
  cypher: string,
  parameters: QueryParameters = {},
): Promise<QueryResult> {
  const cfg = getConfig();
  const session: Session = driver.session({ database: cfg.database });

  try {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        return await session.run(cypher, parameters);
      } catch (error: unknown) {
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
