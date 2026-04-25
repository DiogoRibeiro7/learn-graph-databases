# Exercise answers for Lesson 04

# 1) shortest path up to three hops.
MATCH (a:Customer {name: "Alice"}), (b:Customer {name: "Bruno"})
MATCH p = shortestPath((a)-[:PLACED*..3]-(b))
RETURN p;

# 2) Conceptual:
# shortestPath() optimizes for fewest hops (unweighted). For weighted shortest paths use GDS Dijkstra.

# 3)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC;

# 4)
MATCH (c1:Customer)-[:PLACED]->(:Order)<-[:PLACED]-(c2:Customer)
WHERE c1 <> c2
RETURN c1.name AS customerA, c2.name AS customerB, count(*) AS sharedOrders
ORDER BY sharedOrders DESC;

# 5) Conceptual:
# Community detection groups densely connected clusters; shortest path finds minimal routes between two nodes.
# Example GDS community algorithm: Louvain.
