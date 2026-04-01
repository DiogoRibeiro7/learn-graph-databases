/**
 * Reusable Cypher queries for the starter examples.
 */

export const movieQueries = {
  listActorsAndMovies: `
    MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
    RETURN p.name AS person, m.title AS movie
    ORDER BY person, movie
  `,
  coActors: `
    MATCH (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
    WHERE p1 <> p2
    RETURN DISTINCT p1.name AS personA, p2.name AS personB, m.title AS movie
    ORDER BY movie, personA, personB
  `,
  dramaMovies: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,
} as const;
