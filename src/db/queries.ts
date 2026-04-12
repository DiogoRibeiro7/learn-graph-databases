/**
 * Reusable Cypher query templates for the movie graph example.
 *
 * These queries are intended for teaching common graph patterns,
 * like traversal, filtering, aggregation, and parameterised lookups.
 */

export const movieQueries = {
  /**
   * List each person and the movie they acted in.
   */
  listActorsAndMovies: `
    MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
    RETURN p.name AS person, m.title AS movie
    ORDER BY person, movie
  `,

  /**
   * Find actor pairs that share a movie.
   */
  coActors: `
    MATCH (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
    WHERE p1 <> p2
    RETURN DISTINCT p1.name AS personA, p2.name AS personB, m.title AS movie
    ORDER BY movie, personA, personB
  `,

  /**
   * Return all drama movies sorted by year.
   */
  dramaMovies: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,

  /**
   * Count movies grouped by genre.
   */
  genreMovieCounts: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
    WITH g.name AS genre, count(m) AS movieCount
    RETURN genre, movieCount
    ORDER BY movieCount DESC
  `,

  /**
   * Return movies in a specific genre.
   */
  moviesByGenre: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: $genre})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,

  /**
   * Return movies for a specified actor.
   */
  moviesByActor: `
    MATCH (p:Person {name: $actor})-[:ACTED_IN]->(m:Movie)
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,
} as const;

export const fraudQueries = {
  customersSharingIp: `
    MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
    WITH ip, collect(DISTINCT c.name) AS customers
    WHERE size(customers) > 1
    RETURN ip.value AS ip, customers
  `,

  sharedCreditCards: `
    MATCH (:Order)-[:PAID_WITH]->(cc:CreditCard)<-[:PAID_WITH]-(:Order)
    RETURN DISTINCT cc.cardHash AS cardHash
  `,

  communityDetection: `
    CALL gds.graph.project(
      'fraudGraph',
      ['Customer', 'Order'],
      {
        PLACED: {orientation: 'UNDIRECTED'}
      }
    )
    YIELD graphName
    CALL gds.wcc.stream('fraudGraph')
    YIELD componentId, nodeId
    RETURN componentId, gds.util.asNode(nodeId).name AS customer
    ORDER BY componentId, customer
  `,
} as const;

export const supplyChainQueries = {
  supplierComponentFlow: `
    MATCH (s:Supplier)-[:SUPPLIES]->(c:Component)<-[:USES]-(f:Factory)
    RETURN s.name AS supplier, c.name AS component, f.name AS factory
    ORDER BY supplier, component, factory
  `,

  supplierShortestPath: `
    MATCH (s1:Supplier {name: "North Metals"}), (s2:Supplier {name: "Blue Circuits"})
    MATCH p = shortestPath((s1)-[:SUPPLIES*..4]-(s2))
    RETURN p, length(p) AS hops
  `,
} as const;
