import type { Record as Neo4jRecord } from "neo4j-driver";
import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { movieQueries } from "../db/queries.js";

/**
 * Converts a Neo4j record into a plain JavaScript object for logging.
 *
 * @param record - Neo4j result record.
 * @returns Plain object representation.
 */
function toObject(record: Neo4jRecord): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  for (const key of record.keys) {
    output[key] = record.get(key);
  }

  return output;
}

/**
 * Runs a few starter queries for the movie graph.
 */
async function main(): Promise<void> {
  const driver = createDriver();

  try {
    const queries: Array<[string, string]> = [
      ["Actors and movies", movieQueries.listActorsAndMovies],
      ["Co-actors", movieQueries.coActors],
      ["Drama movies", movieQueries.dramaMovies],
    ];

    for (const [label, cypher] of queries) {
      const result = await runQuery(driver, cypher);
      console.log(`\n=== ${label} ===`);
      console.table(result.records.map(toObject));
    }
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to run movie queries.");
  console.error(error);
  process.exitCode = 1;
});
