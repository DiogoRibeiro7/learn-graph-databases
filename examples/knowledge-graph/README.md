# Knowledge Graph Example

This example demonstrates a simple knowledge graph with entities, typed relationships, and fact-style statements.

## Contents

- `schema.md` - ontology-like model with entity types and relationship semantics
- `seed.cypher` - seed data for people, organizations, concepts, and documents
- `queries.cypher` - sample queries including inference-style traversals

## Usage

1. Seed the graph:

```bash
yarn seed:kg
```

2. Run the query runner:

```bash
yarn query:kg
```

## Notes

This example is useful for teaching:

- entity-centric modelling (people, orgs, concepts, documents)
- reusable facts as graph edges
- inference-like queries through multi-hop reasoning
- why knowledge graphs are more expressive than table-only joins for semantic questions
