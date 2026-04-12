# Exercises

1. Write a query that finds the shortest path between two customers using up to three hops.
2. Explain why `shortestPath()` is best for unweighted routes and name a GDS algorithm for weighted shortest paths.
3. Write a query that returns customers ordered by the number of orders they placed.
4. Write a query that finds pairs of customers who share the same order.
5. Explain how community detection differs from shortest-path queries and name a GDS algorithm used for communities.

# Answers

1. Example answer:

```cypher
MATCH (a:Customer {name: "Alice"}), (b:Customer {name: "Bruno"})
MATCH p = shortestPath((a)-[:PLACED*..3]-(b))
RETURN p
```

2. `shortestPath()` finds the route with the fewest relationships, not the lowest numeric cost. For weighted paths, use a GDS algorithm such as Dijkstra.

3. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC
```

4. Example answer:

```cypher
MATCH (c1:Customer)-[:PLACED]->(:Order)<-[:PLACED]-(c2:Customer)
WHERE c1 <> c2
RETURN c1.name AS customerA, c2.name AS customerB, count(*) AS sharedOrders
ORDER BY sharedOrders DESC
```
