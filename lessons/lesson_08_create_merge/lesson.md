# Lesson 08 - CREATE and MERGE

## What you'll learn

- How to create nodes and relationships with `CREATE`
- How to write idempotent upserts with `MERGE`
- When to choose `CREATE` vs `MERGE`
- How to use `ON CREATE SET` and `ON MATCH SET`
- How to avoid duplicate data and accidental Cartesian products

## Prerequisites

- Lesson 05: MATCH clause deep dive
- Lesson 06: WHERE clause deep dive
- Lesson 07: RETURN and projections

## Why write semantics matter

Cypher write clauses directly affect data quality. Choosing the wrong write clause can create duplicates or miss updates.

## CREATE

`CREATE` always inserts new graph elements.

```cypher
CREATE (c:Customer {customerId: "C001", name: "Alice", country: "USA"})
CREATE (o:Order {orderId: "O1001", totalAmount: 150, status: "PLACED"})
CREATE (c)-[:PLACED]->(o)
```

Use `CREATE` when:

- data is guaranteed new
- duplicates are acceptable by design
- loading append-only events

## MERGE

`MERGE` matches an existing pattern or creates it if missing.

```cypher
MERGE (c:Customer {customerId: "C001"})
ON CREATE SET c.name = "Alice", c.country = "USA", c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime()
```

Use `MERGE` when:

- you need idempotent writes
- repeated runs of the same script should not duplicate entities
- you want upsert behavior

## MERGE on relationships

```cypher
MERGE (c:Customer {customerId: "C001"})
MERGE (o:Order {orderId: "O1001"})
MERGE (c)-[:PLACED]->(o)
```

This ensures the relationship exists exactly once for that node pair and type.

## CREATE vs MERGE

- `CREATE`: always new
- `MERGE`: match-or-create

Rule of thumb:

- stable identifiers (`customerId`, `orderId`) pair well with `MERGE`
- event logs or snapshots often use `CREATE`

## ON CREATE SET / ON MATCH SET

These let you set properties depending on whether `MERGE` created or matched:

```cypher
MERGE (ip:IP {value: "203.0.113.10"})
ON CREATE SET ip.firstSeen = datetime(), ip.riskScore = 10
ON MATCH SET ip.lastSeen = datetime(), ip.hitCount = coalesce(ip.hitCount, 0) + 1
```

## Common pitfalls

### Duplicate data from CREATE

```cypher
CREATE (:Customer {customerId: "C001", name: "Alice"})
CREATE (:Customer {customerId: "C001", name: "Alice"})
```

This creates two nodes.

### Over-wide MERGE pattern

```cypher
MERGE (c:Customer {customerId: "C001", lastSeenAt: datetime()})
```

Including volatile fields inside `MERGE` keys causes repeated creates. Keep identity keys stable and set changing fields with `SET`.

### Cartesian products in writes

```cypher
MATCH (c:Customer), (o:Order)
CREATE (c)-[:PLACED]->(o)
```

This creates every possible pair. Link entities through proper predicates or identifiers before creating relationships.

## Practical guidance

- Put uniqueness constraints on natural keys used in `MERGE`.
- Keep `MERGE` patterns minimal and identity-focused.
- Apply mutable property updates using `SET`, not inside identity maps.
- Test seed scripts by running them twice and verifying no duplicates.

## Summary

`CREATE` and `MERGE` define whether your writes are append-only or idempotent. Correct use of each clause, plus `ON CREATE SET` and `ON MATCH SET`, is essential for predictable graph data pipelines.


## Diagram

See ../../assets/diagrams/lessons/lesson_08_create_merge.mmd for a companion Mermaid diagram.
