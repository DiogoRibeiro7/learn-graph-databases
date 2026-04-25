# Lesson 03 - Cypher basics

## What you'll learn

- How to write Cypher queries for matched graph patterns
- How to filter, aggregate, and return data
- When to use `MATCH`, `WHERE`, `WITH`, and `MERGE`

## Prerequisites

- Lesson 01: Introduction to graph databases
- Lesson 02: Graph modelling

## Concept

Cypher lets you express graph patterns directly as node and relationship structures.

A Cypher query is a graph pattern description, followed by filtering and result projection.

## MATCH

`MATCH` is the heart of most Cypher queries. It describes the nodes and relationships you want to find.

Each node can have a variable name, a label, and properties. Relationships can be directional and typed.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c, o
```

This finds each customer who placed an order.

You can also match multiple patterns in a single query:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order),
      (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, o.orderId, cc.cardHash
```

## WHERE

Use `WHERE` to filter the results of a matched pattern.

A `WHERE` clause applies conditions to node properties, relationship properties, or computed values.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country = "USA"
RETURN c.name, o.orderId
```

Common filter patterns include equality, ranges, and membership tests:

```cypher
MATCH (o:Order)
WHERE o.totalAmount > 100 AND o.status IN ["SHIPPED", "DELIVERED"]
RETURN o.orderId, o.totalAmount
```

## RETURN

`RETURN` controls what the query returns. You can return entire nodes, selected properties, aggregates, or computed values.

Use aliases to make results easier to read.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC
```

You can also return collections or unique values:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, collect(o.orderId) AS orders
```

## Aggregation

Aggregation lets you summarize multiple rows into a single result. Common functions include `count()`, `sum()`, `avg()`, `min()`, `max()`, and `collect()`.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer,
       count(o) AS orderCount,
       sum(o.totalAmount) AS totalSpent
ORDER BY totalSpent DESC
```

Aggregation is often used together with `WITH` so you can filter or transform aggregated results before returning them.

## WITH

`WITH` lets you pass results from one part of a query to the next. It is useful for aggregation, filtering intermediate results, and controlling which variables are available in later query stages.

`WITH` behaves like a pipeline step. Anything not included in the `WITH` clause is discarded, so it is common to use aliases and aggregations.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC
```

This first counts orders per customer, then filters customers with more than one order before returning the results.

You can also use `WITH` to aggregate and collect values before returning them:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, collect(o.orderId) AS orders
RETURN c.name, orders
```

`WITH` is especially useful when you need to apply `WHERE` or `ORDER BY` after aggregating data.

## UNWIND

`UNWIND` turns a list into a sequence of rows. It is useful when you want to create or match multiple values from an array, or when you need to expand a collection into separate query rows.

Example:

```cypher
UNWIND ["Action", "Drama", "Sci-Fi"] AS genreName
MERGE (g:Genre {name: genreName})
```

This creates or matches one `Genre` node for each genre name in the list.

You can also use `UNWIND` with `WITH` to split a collected list back into rows:

```cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WITH p, collect(m.title) AS movies
UNWIND movies AS movieTitle
RETURN p.name, movieTitle
ORDER BY p.name, movieTitle
```

That returns each actor with one movie title per row.

## Variable-length paths

Variable-length paths let you match the same relationship type multiple times in one pattern. Use `*` with a range to control how many hops to include.

Example:

```cypher
MATCH (c:Customer)-[:PLACED*1..2]->(o:Order)
RETURN c.name, o.orderId
```

`[:PLACED*1..2]` matches paths with one or two `PLACED` relationships.

You can also use `shortestPath()` to find the shortest path between two nodes when multiple routes exist:

```cypher
MATCH (c:Customer {name: "Alice"}), (o:Order {orderId: "O1001"})
MATCH p = shortestPath((c)-[:PLACED*..3]->(o))
RETURN p
```

This is useful when you want only the smallest path through the graph.

## UNION

`UNION` combines the results of two or more queries that return the same column structure. `UNION` removes duplicate rows by default. Use `UNION ALL` when you want to preserve duplicates.

Example:

```cypher
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie
```

This returns a single list of movie titles from both genres.

If you want to keep duplicate values, use `UNION ALL`:

```cypher
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION ALL
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie
```

`UNION ALL` is useful when duplicate values are meaningful, such as counting repeated matches.

## FOREACH

`FOREACH` executes a write operation for each element in a list. It is useful for applying updates or creating patterns from a collection of values.

`FOREACH` is only for executing updates; it does not return rows.

Example:

```cypher
UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName})
FOREACH (_ IN CASE WHEN genreName = "Sci-Fi" THEN [1] ELSE [] END |
  SET g.featured = true
)
```

This uses `FOREACH` to set a property only for the `Sci-Fi` genre.

## CREATE

`CREATE` adds new nodes or relationships to the graph. Use it when you are sure the data does not already exist.

Example:

```cypher
CREATE (c:Customer {name: "Alice", country: "USA"})
CREATE (o:Order {orderId: "O1001", totalAmount: 150})
CREATE (c)-[:PLACED]->(o)
```

`CREATE` always writes new graph elements. If the same pattern already exists, it will create duplicates.

## MERGE

`MERGE` ensures a pattern exists without creating duplicates. If the pattern is already present, it matches it. If not, it creates it.

Example:

```cypher
MERGE (c:Customer {name: "Alice"})
MERGE (o:Order {orderId: "O1001"})
MERGE (c)-[:PLACED]->(o)
```

Use `MERGE` for idempotent writes when you want to avoid creating duplicate nodes or relationships.

`MERGE` can also set properties conditionally using `ON CREATE` and `ON MATCH`:

```cypher
MERGE (c:Customer {name: "Alice"})
ON CREATE SET c.created = timestamp()
ON MATCH SET c.lastSeen = timestamp()
```

This creates the customer if needed, and updates a timestamp only on existing nodes.

If you only want to read existing data, use `MATCH` instead. `MERGE` can also create relationships as part of its pattern.

## Why it matters

This style of query keeps the graph structure visible in the query itself.

The graph pattern appears as a mini-graph sequence, and the query reads like a traversal from one node to another.

## Practical example

This lesson is designed to be practiced with the repository's example domains. Use `yarn seed:fraud` and `yarn query:fraud` to explore the fraud graph, or `yarn seed:movies` and `yarn query:movies` for the movie domain.

## Common mistakes

- confusing `CREATE` and `MERGE`
- forgetting direction when it matters
- returning large patterns without filtering
- using `WHERE` before `MATCH`
- returning nodes when you only need properties

## Summary

This lesson explained Cypher basics, including pattern matching, filtering, aggregation, and idempotent writes. You learned how to build queries that explore graph structure, summarize results, and avoid common query mistakes.

## What's next

Continue to Lesson 04 to see how graph algorithms extend Cypher concepts and help answer more advanced connection questions.


## Diagram

See ../../assets/diagrams/lessons/lesson_03_cypher.mmd for a companion Mermaid diagram.
