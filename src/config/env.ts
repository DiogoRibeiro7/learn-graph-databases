import { config as loadDotEnv } from "dotenv";
import type { AppConfig } from "../types/graph.js";

loadDotEnv();

/**
 * Reads a required environment variable and fails fast with a descriptive error.
 *
 * @param name - Environment variable name.
 * @returns The environment variable value.
 * @throws Error if the variable is not defined or is empty.
 */
function requireEnv(name: string): string {
  const value: string | undefined = process.env[name];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Loads and validates the runtime configuration for the Neo4j connection.
 *
 * @returns Validated application configuration.
 */
export function getConfig(): AppConfig {
  return {
    uri: requireEnv("NEO4J_URI"),
    username: requireEnv("NEO4J_USERNAME"),
    password: requireEnv("NEO4J_PASSWORD"),
    database: requireEnv("NEO4J_DATABASE"),
  };
}
