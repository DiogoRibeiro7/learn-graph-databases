# Ontology-Driven Example

This example demonstrates ontology-driven graph modelling with a simple biomedical domain.

## Contents

- `schema.md` - ontology classes, properties, and modelling constraints
- `seed.cypher` - ontology definition nodes plus conforming instance data
- `queries.cypher` - inference-style and reasoning queries

## Usage

1. Seed the graph:

```bash
yarn seed:ontology
```

2. Run the query runner:

```bash
yarn query:ontology
```

## Notes

This example is useful for teaching:

- ontology classes and properties represented as graph data
- instance validation against class definitions
- subclass-driven inference patterns
- biomedical-style reasoning across genes, diseases, and therapies
