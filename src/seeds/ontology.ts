/**
 * Ontology graph seeding utilities.
 */
import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";
import { logger } from "../logging/logger.js";

const seedCypher = `
  MERGE (cEntity:OntologyClass {name: "Entity"})
  MERGE (cGene:OntologyClass {name: "Gene"})
  MERGE (cDisease:OntologyClass {name: "Disease"})
  MERGE (cDrug:OntologyClass {name: "Drug"})
  MERGE (cPathway:OntologyClass {name: "Pathway"})
  MERGE (cPatient:OntologyClass {name: "Patient"})
  MERGE (cTherapy:OntologyClass {name: "Therapy"})

  MERGE (cGene)-[:SUBCLASS_OF]->(cEntity)
  MERGE (cDisease)-[:SUBCLASS_OF]->(cEntity)
  MERGE (cDrug)-[:SUBCLASS_OF]->(cTherapy)
  MERGE (cTherapy)-[:SUBCLASS_OF]->(cEntity)
  MERGE (cPathway)-[:SUBCLASS_OF]->(cEntity)
  MERGE (cPatient)-[:SUBCLASS_OF]->(cEntity)

  MERGE (pAssoc:OntologyProperty {name: "ASSOCIATED_WITH"})
  MERGE (pTargets:OntologyProperty {name: "TARGETS"})
  MERGE (pTreats:OntologyProperty {name: "TREATS"})
  MERGE (pParticipates:OntologyProperty {name: "PARTICIPATES_IN"})
  MERGE (pDiagnosed:OntologyProperty {name: "DIAGNOSED_WITH"})
  MERGE (pPrescribed:OntologyProperty {name: "PRESCRIBED"})

  MERGE (pAssoc)-[:DOMAIN]->(cGene)
  MERGE (pAssoc)-[:RANGE]->(cDisease)
  MERGE (pTargets)-[:DOMAIN]->(cDrug)
  MERGE (pTargets)-[:RANGE]->(cGene)
  MERGE (pTreats)-[:DOMAIN]->(cDrug)
  MERGE (pTreats)-[:RANGE]->(cDisease)
  MERGE (pParticipates)-[:DOMAIN]->(cGene)
  MERGE (pParticipates)-[:RANGE]->(cPathway)
  MERGE (pDiagnosed)-[:DOMAIN]->(cPatient)
  MERGE (pDiagnosed)-[:RANGE]->(cDisease)
  MERGE (pPrescribed)-[:DOMAIN]->(cPatient)
  MERGE (pPrescribed)-[:RANGE]->(cDrug)

  MERGE (g1:Entity:Gene {id: "G001"}) SET g1.name = "EGFR"
  MERGE (g2:Entity:Gene {id: "G002"}) SET g2.name = "BRAF"
  MERGE (g3:Entity:Gene {id: "G003"}) SET g3.name = "ALK"
  MERGE (d1:Entity:Disease {id: "D001"}) SET d1.name = "Lung Cancer"
  MERGE (d2:Entity:Disease {id: "D002"}) SET d2.name = "Melanoma"
  MERGE (dr1:Entity:Drug {id: "DR001"}) SET dr1.name = "Erlotinib"
  MERGE (dr2:Entity:Drug {id: "DR002"}) SET dr2.name = "Vemurafenib"
  MERGE (dr3:Entity:Drug {id: "DR003"}) SET dr3.name = "Crizotinib"
  MERGE (pw1:Entity:Pathway {id: "PW001"}) SET pw1.name = "MAPK Signaling"
  MERGE (pw2:Entity:Pathway {id: "PW002"}) SET pw2.name = "RTK Signaling"
  MERGE (pt1:Entity:Patient {id: "PT001"}) SET pt1.name = "Alice"
  MERGE (pt2:Entity:Patient {id: "PT002"}) SET pt2.name = "Bruno"

  MERGE (g1)-[:INSTANCE_OF]->(cGene)
  MERGE (g2)-[:INSTANCE_OF]->(cGene)
  MERGE (g3)-[:INSTANCE_OF]->(cGene)
  MERGE (d1)-[:INSTANCE_OF]->(cDisease)
  MERGE (d2)-[:INSTANCE_OF]->(cDisease)
  MERGE (dr1)-[:INSTANCE_OF]->(cDrug)
  MERGE (dr2)-[:INSTANCE_OF]->(cDrug)
  MERGE (dr3)-[:INSTANCE_OF]->(cDrug)
  MERGE (pw1)-[:INSTANCE_OF]->(cPathway)
  MERGE (pw2)-[:INSTANCE_OF]->(cPathway)
  MERGE (pt1)-[:INSTANCE_OF]->(cPatient)
  MERGE (pt2)-[:INSTANCE_OF]->(cPatient)

  MERGE (g1)-[:ASSOCIATED_WITH]->(d1)
  MERGE (g2)-[:ASSOCIATED_WITH]->(d2)
  MERGE (g3)-[:ASSOCIATED_WITH]->(d1)
  MERGE (dr1)-[:TARGETS]->(g1)
  MERGE (dr2)-[:TARGETS]->(g2)
  MERGE (dr3)-[:TARGETS]->(g3)
  MERGE (dr1)-[:TREATS]->(d1)
  MERGE (dr2)-[:TREATS]->(d2)
  MERGE (g1)-[:PARTICIPATES_IN]->(pw2)
  MERGE (g2)-[:PARTICIPATES_IN]->(pw1)
  MERGE (g3)-[:PARTICIPATES_IN]->(pw2)
  MERGE (pt1)-[:DIAGNOSED_WITH]->(d1)
  MERGE (pt2)-[:DIAGNOSED_WITH]->(d2)
  MERGE (pt1)-[:PRESCRIBED]->(dr1)
  MERGE (pt2)-[:PRESCRIBED]->(dr2)
`;

export async function seedOntology(driver: Driver): Promise<void> {
  const result = await runQuery(driver, seedCypher);
  const counters = (result as any)?.summary?.counters as any;

  logger.info("Ontology seed summary", {
    nodesCreated: counters?.nodesCreated?.() ?? 0,
    relationshipsCreated: counters?.relationshipsCreated?.() ?? 0,
    propertiesSet: counters?.propertiesSet?.() ?? 0,
  });
}
