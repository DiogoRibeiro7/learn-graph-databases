/**
 * Recommendation graph seeding utilities.
 *
 * This module creates a sample recommendation graph with users, items,
 * categories, tags, and interaction events.
 */
import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";
import { logger } from "../logging/logger.js";

/**
 * Cypher payload used to seed the recommendation graph.
 */
const seedCypher = `
  MERGE (u1:User {userId: "U001"}) SET u1.name = "Alice"
  MERGE (u2:User {userId: "U002"}) SET u2.name = "Bruno"
  MERGE (u3:User {userId: "U003"}) SET u3.name = "Carla"
  MERGE (u4:User {userId: "U004"}) SET u4.name = "Diego"
  MERGE (u5:User {userId: "U005"}) SET u5.name = "Eva"

  MERGE (i1:Item {itemId: "I001"}) SET i1.title = "Graph Databases 101", i1.type = "book"
  MERGE (i2:Item {itemId: "I002"}) SET i2.title = "Cypher in Practice", i2.type = "book"
  MERGE (i3:Item {itemId: "I003"}) SET i3.title = "Practical Neo4j", i3.type = "course"
  MERGE (i4:Item {itemId: "I004"}) SET i4.title = "Deep Learning Basics", i4.type = "course"
  MERGE (i5:Item {itemId: "I005"}) SET i5.title = "Graph Analytics", i5.type = "book"
  MERGE (i6:Item {itemId: "I006"}) SET i6.title = "Data Pipelines at Scale", i6.type = "course"

  MERGE (cGraph:Category {name: "Graph"})
  MERGE (cMl:Category {name: "Machine Learning"})
  MERGE (cData:Category {name: "Data Engineering"})

  MERGE (tCypher:Tag {name: "Cypher"})
  MERGE (tNeo4j:Tag {name: "Neo4j"})
  MERGE (tRecsys:Tag {name: "Recommender Systems"})
  MERGE (tPython:Tag {name: "Python"})
  MERGE (tMLOps:Tag {name: "MLOps"})

  MERGE (i1)-[:IN_CATEGORY]->(cGraph)
  MERGE (i2)-[:IN_CATEGORY]->(cGraph)
  MERGE (i3)-[:IN_CATEGORY]->(cGraph)
  MERGE (i4)-[:IN_CATEGORY]->(cMl)
  MERGE (i5)-[:IN_CATEGORY]->(cGraph)
  MERGE (i6)-[:IN_CATEGORY]->(cData)

  MERGE (i1)-[:HAS_TAG]->(tNeo4j)
  MERGE (i1)-[:HAS_TAG]->(tCypher)
  MERGE (i2)-[:HAS_TAG]->(tCypher)
  MERGE (i2)-[:HAS_TAG]->(tRecsys)
  MERGE (i3)-[:HAS_TAG]->(tNeo4j)
  MERGE (i3)-[:HAS_TAG]->(tRecsys)
  MERGE (i4)-[:HAS_TAG]->(tPython)
  MERGE (i5)-[:HAS_TAG]->(tNeo4j)
  MERGE (i5)-[:HAS_TAG]->(tRecsys)
  MERGE (i6)-[:HAS_TAG]->(tMLOps)

  MERGE (u1)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:00:00Z"}]->(i1)
  MERGE (u1)-[:INTERACTED {event: "like", rating: 4, at: "2026-04-01T10:05:00Z"}]->(i2)
  MERGE (u1)-[:INTERACTED {event: "view", rating: 3, at: "2026-04-01T10:08:00Z"}]->(i3)

  MERGE (u2)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:10:00Z"}]->(i1)
  MERGE (u2)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:14:00Z"}]->(i3)
  MERGE (u2)-[:INTERACTED {event: "view", rating: 3, at: "2026-04-01T10:18:00Z"}]->(i5)

  MERGE (u3)-[:INTERACTED {event: "like", rating: 4, at: "2026-04-01T10:20:00Z"}]->(i2)
  MERGE (u3)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:24:00Z"}]->(i5)
  MERGE (u3)-[:INTERACTED {event: "view", rating: 3, at: "2026-04-01T10:30:00Z"}]->(i4)

  MERGE (u4)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:35:00Z"}]->(i4)
  MERGE (u4)-[:INTERACTED {event: "like", rating: 4, at: "2026-04-01T10:38:00Z"}]->(i6)
  MERGE (u4)-[:INTERACTED {event: "view", rating: 3, at: "2026-04-01T10:42:00Z"}]->(i2)

  MERGE (u5)-[:INTERACTED {event: "like", rating: 5, at: "2026-04-01T10:45:00Z"}]->(i3)
  MERGE (u5)-[:INTERACTED {event: "like", rating: 4, at: "2026-04-01T10:48:00Z"}]->(i5)
  MERGE (u5)-[:INTERACTED {event: "view", rating: 3, at: "2026-04-01T10:52:00Z"}]->(i6)
`;

/**
 * Seeds the recommendation example graph.
 *
 * @param driver - Active Neo4j driver.
 * @returns A promise that resolves once the recommendation graph is created.
 */
export async function seedRecommendation(driver: Driver): Promise<void> {
  const result = await runQuery(driver, seedCypher);
  const counters = (result as any)?.summary?.counters as any;

  logger.info("Recommendation seed summary", {
    nodesCreated: counters?.nodesCreated?.() ?? 0,
    relationshipsCreated: counters?.relationshipsCreated?.() ?? 0,
    propertiesSet: counters?.propertiesSet?.() ?? 0,
  });
}
