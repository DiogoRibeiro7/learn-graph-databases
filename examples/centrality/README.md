# Centrality Example

This example demonstrates centrality algorithms with Neo4j GDS for influencer and critical-connector detection.

## Contents

- `schema.md` - graph model for person-to-person influence network
- `seed.cypher` - seed data with weighted interaction edges
- `queries.cypher` - GDS projection and centrality algorithm queries

## Usage

1. Seed the graph:

```bash
yarn seed:centrality
```

2. Run the centrality query runner:

```bash
yarn query:centrality
```

## Included algorithms

- PageRank (influence score)
- Betweenness centrality (critical connectors)
- Degree centrality (local hub activity)

## Practical use case

Use this example to identify:

- top influencers in a communication network
- bridge entities whose removal disrupts information flow
- highly active hubs for monitoring or capacity planning
