/**
 * Supply chain graph seeding utilities.
 *
 * This module creates a small supply-chain graph with suppliers,
 * components, and factory usage relationships.
 */
import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";

/**
 * Cypher payload used to seed the supply-chain graph.
 */
const seedCypher = `
  MERGE (s1:Supplier {supplierId: "S001", name: "North Metals"})
  MERGE (s2:Supplier {supplierId: "S002", name: "Blue Circuits"})
  MERGE (f1:Factory {factoryId: "F001", name: "Porto Assembly"})
  MERGE (c1:Component {componentId: "CMP-01", name: "Steel Frame"})
  MERGE (c2:Component {componentId: "CMP-02", name: "Control Board"})
  MERGE (s1)-[:SUPPLIES]->(c1)
  MERGE (s2)-[:SUPPLIES]->(c2)
  MERGE (f1)-[:USES]->(c1)
  MERGE (f1)-[:USES]->(c2)
`;

/**
 * Seeds the supply-chain example graph.
 *
 * @param driver - Active Neo4j driver.
 * @returns A promise that resolves once the supply-chain graph is created.
 */
export async function seedSupplyChain(driver: Driver): Promise<void> {
  await runQuery(driver, seedCypher);
}
