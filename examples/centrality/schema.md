# Centrality graph schema

## Node labels

- `Person`

## Relationship types

- `INTERACTS_WITH` (`Person -> Person`)
  - `weight` (interaction strength)

## Why this model

Centrality algorithms operate on graph structure and connectivity:

- PageRank highlights nodes receiving influence from influential peers.
- Betweenness centrality highlights nodes that bridge paths between others.
- Degree centrality highlights nodes with many direct links.

## Example questions

- Who are the top influencers in this network?
- Which people are critical connectors?
- Which people are local hubs with many direct interactions?
