# Lesson 09 - Aggregation functions

## What you'll learn

- How to summarize rows with `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, and `COLLECT`
- Cypher's implicit grouping behavior
- `COUNT(*)` vs `COUNT(n)`
- How to chain aggregation stages with `WITH`
- How to expand collected lists using `UNWIND`

## Prerequisites

- Lesson 05: MATCH clause deep dive
- Lesson 06: WHERE clause deep dive
- Lesson 07: RETURN and projections

## Why aggregation matters

Graph queries often return many rows. Aggregation converts raw matches into useful metrics like totals, averages, and ranked summaries.

## Core aggregation functions

Count rows:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC
```

Numeric summaries:

```cypher
MATCH (:Customer)-[:PLACED]->(o:Order)
RETURN sum(o.totalAmount) AS totalRevenue,
       avg(o.totalAmount) AS avgOrderValue,
       min(o.totalAmount) AS minOrder,
       max(o.totalAmount) AS maxOrder
```

Collect values into lists:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, collect(o.orderId) AS orderIds
ORDER BY customer
```

## Implicit grouping in Cypher

Any non-aggregated expression in `RETURN` or `WITH` becomes a grouping key.

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.country AS country, count(o) AS orderCount
ORDER BY orderCount DESC
```

Here, rows are grouped by `country`.

## COUNT(*) vs COUNT(n)

- `COUNT(*)` counts rows, including rows where variables may be null.
- `COUNT(n)` counts non-null values of `n`.

Example with optional data:

```cypher
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:PLACED]->(o:Order)
RETURN c.name AS customer,
       count(*) AS rowCount,
       count(o) AS nonNullOrders
ORDER BY customer
```

## Chaining aggregation with WITH

`WITH` lets you aggregate, filter, and continue querying.

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount, sum(o.totalAmount) AS totalSpent
WHERE orderCount >= 2
RETURN c.name AS customer, orderCount, totalSpent
ORDER BY totalSpent DESC
```

## COLLECT + UNWIND

Use `COLLECT` to build lists, then `UNWIND` to expand them back to rows.

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, collect(o.orderId) AS orderIds
UNWIND orderIds AS orderId
RETURN c.name AS customer, orderId
ORDER BY customer, orderId
```

This pattern is useful for staged transformations.

## Common pitfalls

- Mixing too many grouping keys unintentionally
- Assuming `count(variable)` behaves like `count(*)`
- Aggregating before applying needed filters
- Collecting very large lists without considering memory usage

## Practical guidance

- Start by deciding the grouping key explicitly.
- Alias aggregated fields clearly (`orderCount`, `totalSpent`).
- Use `WITH` between stages to keep logic readable.
- Keep `COLLECT` lists scoped and purposeful.

## Summary

Aggregation in Cypher turns traversal output into decision-ready summaries. Mastering implicit grouping, `COUNT(*)` vs `COUNT(n)`, and `WITH`/`UNWIND` pipelines helps you write reliable analytical graph queries.


## Diagram

See ../../assets/diagrams/lessons/lesson_09_aggregation_functions.mmd for a companion Mermaid diagram.
