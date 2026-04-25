# Supply Chain Example

This example demonstrates a multi-tier supply chain graph with suppliers, components, factories, and risk-aware dependency relationships.

## Contents

- `schema.md` - graph schema and node/relationship definitions
- `seed.cypher` - richer multi-tier supply chain seed data with geography and risk metadata
- `queries.cypher` - sample Cypher queries for dependency and resilience analysis

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

4. Run the dedicated supply-chain analysis runner:

```bash
yarn analyze:supply
```

5. The example includes:
- multi-tier supplier exposure analysis
- single-point-of-failure detection queries
- shortest-path exploration and optional weighted path pattern with GDS

## Notes

The supply chain example is useful for teaching:

- supplier/factory/component relationships
- product flow and dependency analysis
- geographic and supplier risk modelling
- pathfinding concepts for route planning and impact analysis
