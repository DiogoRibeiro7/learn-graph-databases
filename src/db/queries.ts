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
