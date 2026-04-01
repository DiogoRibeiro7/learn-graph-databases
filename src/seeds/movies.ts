import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";

const seedCypher = `
  MERGE (ana:Person {name: "Ana"})
  MERGE (bruno:Person {name: "Bruno"})
  MERGE (carla:Person {name: "Carla"})
  MERGE (m1:Movie {title: "Signal at Midnight", year: 2022})
  MERGE (m2:Movie {title: "Summer in Porto", year: 2023})
  MERGE (g1:Genre {name: "Drama"})
  MERGE (g2:Genre {name: "Mystery"})
  MERGE (ana)-[:ACTED_IN {role: "Eva"}]->(m1)
  MERGE (bruno)-[:ACTED_IN {role: "Miguel"}]->(m1)
  MERGE (carla)-[:DIRECTED]->(m1)
  MERGE (ana)-[:ACTED_IN {role: "Leonor"}]->(m2)
  MERGE (carla)-[:DIRECTED]->(m2)
  MERGE (m1)-[:IN_GENRE]->(g1)
  MERGE (m1)-[:IN_GENRE]->(g2)
  MERGE (m2)-[:IN_GENRE]->(g1)
`;

/**
 * Seeds the movie example graph.
 *
 * @param driver - Active Neo4j driver.
 */
export async function seedMovies(driver: Driver): Promise<void> {
  await runQuery(driver, seedCypher);
}
