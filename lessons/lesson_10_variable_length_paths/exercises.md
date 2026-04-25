# Exercises

1. Write a query that matches `TRANSFERRED_TO` paths from 1 to 3 hops.
2. Write a query that matches exactly two `TRANSFERRED_TO` hops.
3. Bind a path variable and return hop count with `length(p)`.
4. Return the node IDs from a path using `nodes(p)`.
5. Return relationship types from a path using `relationships(p)`.
6. Find one shortest path between accounts `A1` and `A8`.
7. Find all shortest paths between accounts `A1` and `A8`.
8. Write a bounded traversal from supplier `S1` up to 3 hops.
9. Explain why upper bounds are important in variable-length patterns.
10. Explain when `allShortestPaths` is preferred over `shortestPath`.

# Answers

1. Example answer:

```cypher
MATCH (a:Account)-[:TRANSFERRED_TO*1..3]->(b:Account)
RETURN a.accountId AS source, b.accountId AS target
```

2. Example answer:

```cypher
MATCH (a:Account)-[:TRANSFERRED_TO*2..2]->(b:Account)
RETURN a.accountId AS source, b.accountId AS twoHopTarget
```

3. Example answer:

```cypher
MATCH p = (a:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target, length(p) AS hops
ORDER BY hops, target
```

4. Example answer:

```cypher
MATCH p = (:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target, [n IN nodes(p) | n.accountId] AS accountChain
```

5. Example answer:

```cypher
MATCH p = (:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(s:Supplier)
RETURN s.supplierId AS target, [r IN relationships(p) | type(r)] AS relTypes
```

6. Example answer:

```cypher
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = shortestPath((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops
```

7. Example answer:

```cypher
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = allShortestPaths((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops
```

8. Example answer:

```cypher
MATCH p = (s:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(downstream:Supplier)
RETURN downstream.supplierId AS downstreamSupplier, length(p) AS hops
ORDER BY hops, downstreamSupplier
```

9. Answer:

Upper bounds prevent explosive path expansion in dense graphs, improving performance and reducing unintended matches.

10. Answer:

Use `allShortestPaths` when multiple equally short routes are important for analysis; use `shortestPath` when one minimal route is sufficient.
