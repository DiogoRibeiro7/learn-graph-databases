# Recommendation Example

This example demonstrates a recommendation graph with users, items, categories, and interactions.

## Contents

- `schema.md` - graph schema and recommendation-oriented relationships
- `seed.cypher` - seed data for collaborative and content-based recommendation patterns
- `queries.cypher` - sample Cypher queries for recommendation use cases

## Usage

1. Seed the graph:

```bash
yarn seed:recommend
```

2. Run the example query runner:

```bash
yarn query:recommend
```

## Notes

The recommendation example is useful for teaching:

- user-item interaction modelling
- collaborative filtering via shared preferences
- content-based filtering through item metadata
- explainable recommendation patterns in Cypher
