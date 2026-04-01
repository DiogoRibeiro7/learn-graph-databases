import type { Driver, QueryResult, Session } from "neo4j-driver";
import { getConfig } from "../config/env.js";

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

  try {
    return await session.run(cypher, parameters);
  } finally {
    await session.close();
  }
}
