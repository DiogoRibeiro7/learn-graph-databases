import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { knowledgeGraphQueries } from "../db/queries.js";

async function main(): Promise<void> {
  const driver = createDriver();

  try {
    logger.info("Running knowledge graph example queries.");

    const directExperts = await runQuery(driver, knowledgeGraphQueries.directExpertsForConcept, {
      concept: "Knowledge Graphs",
    });
    console.log("\n=== Direct Experts ===");
    console.table(directExperts.records.map((record) => ({
      expert: record.get("expert"),
    })));

    const inferredExperts = await runQuery(driver, knowledgeGraphQueries.inferredExpertsForConcept, {
      concept: "Knowledge Graphs",
    });
    console.log("\n=== Inferred Experts ===");
    console.table(inferredExperts.records.map((record) => ({
      inferredExpert: record.get("inferredExpert"),
      supportingConcepts: record.get("supportingConcepts"),
    })));

    const organizationRelevance = await runQuery(driver, knowledgeGraphQueries.organizationRelevanceForConcept, {
      concept: "Knowledge Graphs",
    });
    console.log("\n=== Organization Relevance ===");
    console.table(organizationRelevance.records.map((record) => ({
      organization: record.get("organization"),
      conceptCoverage: record.get("conceptCoverage"),
    })));

    const bridgePeople = await runQuery(driver, knowledgeGraphQueries.bridgePeopleAcrossConceptNeighborhoods);
    console.log("\n=== Bridge People ===");
    console.table(bridgePeople.records.map((record) => ({
      bridgePerson: record.get("bridgePerson"),
      semanticNeighborhood: record.get("semanticNeighborhood"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run knowledge graph example queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
