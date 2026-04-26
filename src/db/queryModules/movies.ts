import type { Record as Neo4jRecord } from "neo4j-driver";

export type MoviesByGenreParams = Readonly<{
  genre: string;
}>;

export type MoviesByActorParams = Readonly<{
  actor: string;
}>;

export type MovieResultRow = Readonly<{
  movie: string;
  year: unknown;
}>;

export function mapMovieRows(records: Neo4jRecord[]): MovieResultRow[] {
  return records.map((record) => ({
    movie: String(record.get("movie")),
    year: record.get("year"),
  }));
}

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

  genreMovieCounts: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
    WITH g.name AS genre, count(m) AS movieCount
    RETURN genre, movieCount
    ORDER BY movieCount DESC
  `,

  moviesByGenre: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: $genre})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,

  moviesByActor: `
    MATCH (p:Person {name: $actor})-[:ACTED_IN]->(m:Movie)
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,
} as const;
