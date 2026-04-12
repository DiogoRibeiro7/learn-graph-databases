# Fraud Example

This example demonstrates a fraud analysis graph with customers, orders, credit cards, addresses, and IP addresses.

## Contents

- `schema.md` - graph schema and node/relationship definitions
- `seed.cypher` - seed data for a simple fraud scenario
- `queries.cypher` - sample Cypher queries for fraud-related detection patterns

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

4. Use the sample queries to explore shared IPs and payment-card reuse.

## Notes

The fraud example is useful for teaching:

- customer/order relationships
- suspicious connections through shared IPs or cards
- pattern matching for fraud detection
