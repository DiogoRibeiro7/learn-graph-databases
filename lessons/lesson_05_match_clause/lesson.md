# Lesson 05 - MATCH clause deep dive

## What you'll learn

- How `MATCH` describes graph patterns clearly
- How to match nodes, relationships, and paths
- How and when to use multiple `MATCH` clauses
- How `OPTIONAL MATCH` works and when to prefer it

## Prerequisites

- Lesson 01: Introduction to graph databases
- Lesson 02: Graph modelling
- Lesson 03: Cypher basics

## Why MATCH matters

`MATCH` is the core read clause in Cypher. It expresses a graph pattern, and Neo4j returns rows that satisfy that pattern.

Because patterns are visual, `MATCH` lets you query the graph in a way that mirrors how you think about connected data.

## Pattern matching fundamentals

Node pattern:

```cypher
MATCH (c:Customer)
RETURN c
LIMIT 10
```

- `c` is a variable.
- `:Customer` is a label filter.

Node with a property predicate in pattern:

```cypher
MATCH (c:Customer {name: "Alice"})
RETURN c
```

Relationship pattern:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, o.orderId
```

- Direction matters when business meaning depends on source and target.
- You can also match an undirected relationship with `-[:PLACED]-`.

## Matching paths

You can bind a full path to a variable:

```cypher
MATCH p = (c:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN p
LIMIT 5
```

Path functions let you inspect matched paths:

```cypher
MATCH p = (:Customer {name: "Alice"})-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN length(p) AS hops, nodes(p) AS visitedNodes, relationships(p) AS rels, ip.value AS ipAddress
```

## Multiple MATCH clauses

Using multiple `MATCH` clauses can make complex queries easier to read.

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, o.orderId, cc.cardHash
```

This is equivalent to a single `MATCH` with both patterns, but often clearer in staged logic.

You can also use additional `MATCH` clauses after a `WITH` to continue from intermediate results.

## OPTIONAL MATCH

`OPTIONAL MATCH` behaves like a left join: rows from previous clauses are preserved even if the optional pattern does not exist.

```cypher
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:REFERRED_BY]->(referrer:Customer)
RETURN c.name AS customer, referrer.name AS referrer
ORDER BY customer
```

If no referrer exists, `referrer` is `null`.

`OPTIONAL MATCH` is useful for:

- enriching base entities with optional context
- avoiding row loss when relationships are sparse
- producing complete reports where missing links are expected

## Common pitfalls

- Writing disconnected patterns that create accidental Cartesian products
- Forgetting relationship direction when it is semantically important
- Returning full nodes/paths when only a few properties are needed
- Using `OPTIONAL MATCH` without accounting for nulls later in the query

## Practical guidance

- Start with the smallest pattern that proves correctness.
- Add one relationship hop at a time.
- Use `EXPLAIN` or `PROFILE` for multi-hop queries.
- Add labels and property predicates early to reduce search space.

## Summary

`MATCH` is how you express graph traversal intent in Cypher. Mastering node patterns, relationship patterns, paths, multiple `MATCH` stages, and `OPTIONAL MATCH` gives you a strong foundation for all advanced Cypher query design.


## Diagram

See ../../assets/diagrams/lessons/lesson_05_match_clause.mmd for a companion Mermaid diagram.
