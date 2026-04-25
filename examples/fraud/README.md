# Fraud Example

This example demonstrates a fraud analysis graph with customers, accounts, orders, transactions, credit cards, addresses, IP addresses, and devices.

## Contents

- `schema.md` - graph schema and node/relationship definitions
- `seed.cypher` - richer seed data with account transfers and device usage
- `queries.cypher` - sample Cypher queries for shared identifiers, rings, fan-out, and velocity

## Usage

1. Seed the graph:

```bash
yarn seed:fraud
```

2. Run the example queries in Neo4j Browser or `cypher-shell`.

3. Run the TypeScript query runner:

```bash
yarn query:fraud
```

4. Run the dedicated fraud analysis runner:

```bash
yarn analyze:fraud
```

5. Use the sample queries to explore:
- shared IP/device/card infrastructure
- transfer rings across accounts
- fan-out transfer bursts
- high-velocity card usage

## Notes

The fraud example is useful for teaching:

- customer/order relationships
- suspicious connections through shared IPs, cards, and devices
- multi-hop transfer analysis through accounts
- pattern-based fraud detection strategies
