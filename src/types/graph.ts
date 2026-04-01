/**
 * Shared graph-oriented types used by the teaching scripts.
 */

export type NodeProperties = Record<string, string | number | boolean | null>;

export interface QueryResultRow {
  /**
   * A flexible row representation because result keys vary by query.
   */
  readonly [key: string]: unknown;
}

export interface AppConfig {
  readonly uri: string;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}
