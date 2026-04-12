# Movie Example

This example demonstrates a movie graph with actors, directors, movies, and genres.

## Contents

- `schema.md` - graph schema and node/relationship definitions
- `seed.cypher` - seed data for people, movies, and genres
- `queries.cypher` - sample Cypher queries for exploring the movie graph

## Usage

1. Seed the graph:

```bash
yarn seed:movies
```

2. Run the example queries in Neo4j Browser or `cypher-shell`.

3. Run the TypeScript query runner:

```bash
yarn query:movies
```

4. Inspect the graph model and adjust queries as needed.

## Notes

The movie graph is useful for teaching:

- actor/movie relationships
- genre filtering
- shared work and co-actor patterns
