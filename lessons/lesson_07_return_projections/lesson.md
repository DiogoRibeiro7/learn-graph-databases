# Lesson 07 - RETURN and projections

## What you'll learn

- Returning nodes, relationships, and selected properties
- Aliasing with `AS`
- Sorting and pagination with `ORDER BY`, `SKIP`, and `LIMIT`
- Removing duplicates with `DISTINCT`
- Shaping results with map projections

## Prerequisites

- Lesson 03: Cypher basics
- Lesson 05: MATCH clause deep dive
- Lesson 06: WHERE clause deep dive

## Why RETURN matters

`MATCH` finds rows. `RETURN` decides what the query exposes to the caller.

Good `RETURN` clauses produce compact, readable, and API-friendly results instead of raw graph objects when not needed.

## Returning graph elements

You can return full nodes and relationships:

```cypher
MATCH (c:Customer)-[r:PLACED]->(o:Order)
RETURN c, r, o
LIMIT 5
```

This is useful for exploration, but often too verbose for application code.

## Returning properties and aliases

Return only the fields you need and alias them:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId, o.totalAmount AS amount
ORDER BY amount DESC
```

Aliases improve readability in dashboards and API responses.

## ORDER BY, SKIP, LIMIT

Use ordering and pagination to control result windows:

```cypher
MATCH (m:Movie)
RETURN m.title AS title, m.released AS year
ORDER BY year DESC, title ASC
SKIP 10
LIMIT 10
```

- `ORDER BY` gives deterministic result order.
- `SKIP` offsets rows.
- `LIMIT` restricts row count.

## DISTINCT

`DISTINCT` removes duplicate rows based on returned expressions:

```cypher
MATCH (:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN DISTINCT ip.value AS ipAddress
ORDER BY ipAddress
```

It can also be used in aggregations:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(DISTINCT o.orderId) AS distinctOrders
```

## Map projections

Map projections shape results into JSON-like objects directly in Cypher.

Basic projection:

```cypher
MATCH (m:Movie)
RETURN m { .title, .released } AS movie
ORDER BY movie.title
LIMIT 5
```

Projection with computed fields:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount, sum(o.totalAmount) AS totalSpent
RETURN c {
  .name,
  .country,
  orderCount: orderCount,
  totalSpent: totalSpent
} AS customerSummary
ORDER BY customerSummary.totalSpent DESC
```

Nested map projection pattern:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c {
  .name,
  lastOrder: o { .orderId, .totalAmount, .status }
} AS customerOrderView
LIMIT 10
```

## Practical guidance

- Return properties instead of full nodes for application endpoints.
- Always pair pagination with `ORDER BY`.
- Use `DISTINCT` intentionally; avoid it as a blanket fix.
- Prefer map projections when your consumer expects structured payloads.

## Common pitfalls

- Missing `ORDER BY` before `SKIP`/`LIMIT`
- Returning high-cardinality fields when only summaries are needed
- Adding `DISTINCT` where duplicates are semantically meaningful
- Inconsistent alias naming across queries

## Summary

`RETURN` is where query output becomes a usable result contract. By combining aliases, sorting, pagination, `DISTINCT`, and map projections, you can shape Cypher output for analysis, dashboards, and APIs with clear semantics.
