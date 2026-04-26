/**
 * Centrality graph seeding utilities.
 */
import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";
import { logger } from "../logging/logger.js";

const seedCypher = `
  MERGE (p1:Person {personId: "P001"}) SET p1.name = "Ana"
  MERGE (p2:Person {personId: "P002"}) SET p2.name = "Bruno"
  MERGE (p3:Person {personId: "P003"}) SET p3.name = "Carla"
  MERGE (p4:Person {personId: "P004"}) SET p4.name = "Diego"
  MERGE (p5:Person {personId: "P005"}) SET p5.name = "Eva"
  MERGE (p6:Person {personId: "P006"}) SET p6.name = "Fabio"
  MERGE (p7:Person {personId: "P007"}) SET p7.name = "Gabi"
  MERGE (p8:Person {personId: "P008"}) SET p8.name = "Hugo"

  MERGE (p1)-[:INTERACTS_WITH {weight: 5}]->(p2)
  MERGE (p2)-[:INTERACTS_WITH {weight: 4}]->(p3)
  MERGE (p3)-[:INTERACTS_WITH {weight: 5}]->(p4)
  MERGE (p4)-[:INTERACTS_WITH {weight: 3}]->(p5)
  MERGE (p5)-[:INTERACTS_WITH {weight: 4}]->(p6)
  MERGE (p6)-[:INTERACTS_WITH {weight: 2}]->(p7)
  MERGE (p7)-[:INTERACTS_WITH {weight: 3}]->(p8)
  MERGE (p8)-[:INTERACTS_WITH {weight: 2}]->(p1)

  MERGE (p2)-[:INTERACTS_WITH {weight: 6}]->(p5)
  MERGE (p3)-[:INTERACTS_WITH {weight: 5}]->(p6)
  MERGE (p4)-[:INTERACTS_WITH {weight: 4}]->(p7)
  MERGE (p1)-[:INTERACTS_WITH {weight: 4}]->(p4)
  MERGE (p5)-[:INTERACTS_WITH {weight: 5}]->(p8)
  MERGE (p2)-[:INTERACTS_WITH {weight: 3}]->(p7)
`;

export async function seedCentrality(driver: Driver): Promise<void> {
  const result = await runQuery(driver, seedCypher);
  const counters = (result as any)?.summary?.counters as any;

  logger.info("Centrality seed summary", {
    nodesCreated: counters?.nodesCreated?.() ?? 0,
    relationshipsCreated: counters?.relationshipsCreated?.() ?? 0,
    propertiesSet: counters?.propertiesSet?.() ?? 0,
  });
}
