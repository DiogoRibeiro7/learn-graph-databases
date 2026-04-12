# Supply Chain Example

This example demonstrates a supply chain graph with suppliers, components, factories, and relationships between them.

## Contents

- `schema.md` - graph schema and node/relationship definitions
- `seed.cypher` - seed data for a simple supply chain network
- `queries.cypher` - sample Cypher queries for supply-chain exploration

## Usage

1. Seed the graph:

```bash
yarn seed:supply
```

2. Run the example queries in Neo4j Browser or `cypher-shell`.

3. Run the TypeScript query runner:

```bash
yarn query:supply
```

4. The example includes both unweighted shortest-path exploration and a GDS weighted path pattern.

## Notes

The supply chain example is useful for teaching:

- supplier/factory/component relationships
- product flow and dependency analysis
- pathfinding concepts for route planning and impact analysis
