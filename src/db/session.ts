/**
 * Neo4j session and query helpers.
 *
 * This module centralises session lifecycle management for scripts and
 * seed loaders, ensuring the configured database is always used.
 */
import type { Driver, QueryResult, Session } from "neo4j-driver";
import { getConfig } from "../config/env.js";

/**
 * Query parameters passed to Neo4j session execution.
 */
export type QueryParameters = Readonly<Record<string, unknown>>;

/**
 * Runs a read or write Cypher query and returns the raw Neo4j result.
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
    return await session.run(cypher, parameters);
  } finally {
    await session.close();
  }
}
