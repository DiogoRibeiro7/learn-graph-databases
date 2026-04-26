import type { Driver } from "neo4j-driver";
import { logger } from "../logging/logger.js";
import { runQuery } from "../db/session.js";
import { seedMovies } from "./movies.js";
import { seedFraud } from "./fraud.js";
import { seedSupplyChain } from "./supplyChain.js";
import { seedRecommendation } from "./recommendation.js";
import { seedRbac } from "./rbac.js";
import { seedKnowledgeGraph } from "./knowledgeGraph.js";

export const seedDomains = [
  "movies",
  "fraud",
  "supply",
  "recommend",
  "rbac",
  "kg",
] as const;

export type SeedDomain = (typeof seedDomains)[number];

export type SeedDefinition = Readonly<{
  domain: SeedDomain;
  description: string;
  seed: (driver: Driver) => Promise<void>;
}>;

export const seedRegistry = {
  movies: { domain: "movies", description: "Movie graph starter dataset", seed: seedMovies },
  fraud: { domain: "fraud", description: "Fraud detection dataset", seed: seedFraud },
  supply: { domain: "supply", description: "Supply chain dataset", seed: seedSupplyChain },
  recommend: {
    domain: "recommend",
    description: "Recommendation engine dataset",
    seed: seedRecommendation,
  },
  rbac: { domain: "rbac", description: "RBAC authorization dataset", seed: seedRbac },
  kg: { domain: "kg", description: "Knowledge graph dataset", seed: seedKnowledgeGraph },
} as const satisfies Record<SeedDomain, SeedDefinition>;

const definitions: readonly SeedDefinition[] = seedDomains.map((domain) => seedRegistry[domain]);

export type SeedRunOptions = Readonly<{
  clearBeforeSeed: boolean;
}>;

/**
 * Lists all available seed definitions.
 */
export function listSeedDefinitions(): readonly SeedDefinition[] {
  return definitions;
}

/**
 * Type guard for seed domains.
 */
export function isSeedDomain(value: string): value is SeedDomain {
  return seedDomains.includes(value as SeedDomain);
}

/**
 * Clears all graph data before seeding.
 */
export async function clearGraph(driver: Driver): Promise<void> {
  const result = await runQuery(driver, "MATCH (n) DETACH DELETE n");
  const counters = (result as any)?.summary?.counters as any;

  logger.info("Graph clear summary", {
    nodesDeleted: counters?.nodesDeleted?.() ?? 0,
    relationshipsDeleted: counters?.relationshipsDeleted?.() ?? 0,
  });
}

/**
 * Runs one domain seed with optional clear-before-seed lifecycle.
 */
export async function runSeedDomain(
  driver: Driver,
  domain: SeedDomain,
  options: SeedRunOptions,
): Promise<void> {
  const definition = seedRegistry[domain];

  logger.info("Seed lifecycle start", {
    domain,
    clearBeforeSeed: options.clearBeforeSeed,
  });

  if (options.clearBeforeSeed) {
    await clearGraph(driver);
  }

  await definition.seed(driver);

  logger.info("Seed lifecycle completed", { domain });
}
