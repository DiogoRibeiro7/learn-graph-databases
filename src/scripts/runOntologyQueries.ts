import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { ontologyQueries } from "../db/queries.js";
import type { OntologyInferenceParams } from "../db/queryModules/ontology.js";

async function main(): Promise<void> {
  const driver = createDriver();
  const params: OntologyInferenceParams = { patientId: "PT001" };

  try {
    logger.info("Running ontology-driven example queries.");

    const missingTypeResult = await runQuery(driver, ontologyQueries.entitiesMissingType);
    console.log("\n=== Entities Missing Ontology Type ===");
    console.table(missingTypeResult.records.map((record) => ({
      entityId: record.get("entityId"),
      labels: record.get("labels"),
    })));

    const subclassResult = await runQuery(driver, ontologyQueries.subclassExpansion);
    console.log("\n=== Subclass Expansion ===");
    console.table(subclassResult.records.map((record) => ({
      subclass: record.get("subclass"),
      superclass: record.get("superclass"),
    })));

    const inferredResult = await runQuery(driver, ontologyQueries.inferredTherapiesForPatient, params);
    console.log("\n=== Inferred Therapies ===");
    console.table(inferredResult.records.map((record) => ({
      patient: record.get("patient"),
      disease: record.get("disease"),
      inferredDrug: record.get("inferredDrug"),
      supportingGenes: record.get("supportingGenes"),
    })));

    const explanationResult = await runQuery(driver, ontologyQueries.explainInferredTherapyPaths, params);
    console.log("\n=== Inference Paths ===");
    console.table(explanationResult.records.map((record) => ({
      inferencePath: record.get("inferencePath"),
    })));
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run ontology queries.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
