/**
 * Shared graph-oriented types used by the teaching scripts.
 */

/**
 * Represents node property values that can appear in Neo4j records.
 */
export type NodeProperties = Record<string, string | number | boolean | null>;

export interface QueryResultRow {
  /**
   * A flexible row representation because result keys vary by query.
   */
  readonly [key: string]: unknown;
}

export interface AppConfig {
  /** Bolt or Neo4j URI for the runtime connection. */
  readonly uri: string;
  /** Neo4j authentication username. */
  readonly username: string;
  /** Neo4j authentication password. */
  readonly password: string;
  /** Neo4j database name used for session creation. */
  readonly database: string;
}
