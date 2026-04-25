# Lesson 10 - Variable-length paths

## What you'll learn

- How to match variable-length traversals with `[:REL*min..max]`
- How to control traversal depth for safety and performance
- How to use `shortestPath` and `allShortestPaths`
- How to inspect paths with `length()`, `nodes()`, and `relationships()`

## Prerequisites

- Lesson 05: MATCH clause deep dive
- Lesson 06: WHERE clause deep dive
- Lesson 09: Aggregation functions

## Why variable-length paths matter

Many graph questions require multi-hop traversal, such as influence chains, account rings, and dependency traces.

Variable-length patterns let you query unknown or bounded hop counts without writing repetitive fixed-length patterns.

## Basic variable-length syntax

Match one to three hops:

```cypher
MATCH (a:Account)-[:TRANSFERRED_TO*1..3]->(b:Account)
RETURN a.accountId, b.accountId
LIMIT 25
```

- `*1..3` means minimum 1 hop, maximum 3 hops.
- Use upper bounds to avoid runaway expansions.

Exactly two hops:

```cypher
MATCH (a:Account)-[:TRANSFERRED_TO*2..2]->(b:Account)
RETURN a.accountId, b.accountId
```

## Path variables and path functions

Bind the matched path to inspect it:

```cypher
MATCH p = (a:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target,
       length(p) AS hops,
       [n IN nodes(p) | n.accountId] AS accountChain
ORDER BY hops, target
```

Useful path functions:

- `length(p)` returns relationship count
- `nodes(p)` returns ordered nodes in path
- `relationships(p)` returns ordered relationships in path

## shortestPath

Use `shortestPath` when you need one minimal-hop route:

```cypher
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = shortestPath((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops
```

Use bounded lengths (`*..6`) to keep searches tractable.

## allShortestPaths

Use `allShortestPaths` when multiple minimal routes are relevant:

```cypher
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = allShortestPaths((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops
```

## Practical query patterns

Fraud chain exploration:

```cypher
MATCH p = (src:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(dst:Account)
WHERE src <> dst
RETURN dst.accountId AS suspiciousTarget,
       length(p) AS chainLength,
       [n IN nodes(p) | n.accountId] AS pathAccounts
ORDER BY chainLength, suspiciousTarget
```

Dependency tracing with constrained depth:

```cypher
MATCH p = (s:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(critical:Supplier)
RETURN critical.supplierId AS downstreamSupplier, length(p) AS hops
ORDER BY hops
```

## Performance guidance

- Always set an upper bound on variable-length traversals.
- Add label and property predicates on start/end nodes.
- Profile high-branching traversals with `EXPLAIN` or `PROFILE`.
- Keep relationship types specific instead of broad wildcards.

## Common pitfalls

- Unbounded traversals (`*`) in dense graphs
- Assuming `shortestPath` returns all shortest alternatives
- Forgetting that path expansion can revisit nodes unless constrained
- Returning huge path objects when only IDs and hop counts are needed

## Summary

Variable-length paths are essential for multi-hop graph analysis. With bounded patterns, shortest path helpers, and path inspection functions, you can express complex traversal logic while keeping queries practical and performant.
