import neo4j, { type Driver } from "neo4j-driver";
import { getConfig } from "../config/env.js";

/**
 * Builds a Neo4j driver instance from the validated application configuration.
 *
 * The caller is responsible for closing the driver after use.
 *
 * @returns Neo4j driver instance.
 */
export function createDriver(): Driver {
  const cfg = getConfig();

  return neo4j.driver(cfg.uri, neo4j.auth.basic(cfg.username, cfg.password));
}
