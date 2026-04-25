# Exercise answers for Lesson 10

# 1)
MATCH (a:Account)-[:TRANSFERRED_TO*1..3]->(b:Account)
RETURN a.accountId AS source, b.accountId AS target;

# 2)
MATCH (a:Account)-[:TRANSFERRED_TO*2..2]->(b:Account)
RETURN a.accountId AS source, b.accountId AS twoHopTarget;

# 3)
MATCH p = (a:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target, length(p) AS hops
ORDER BY hops, target;

# 4)
MATCH p = (:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target, [n IN nodes(p) | n.accountId] AS accountChain;

# 5)
MATCH p = (:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(s:Supplier)
RETURN s.supplierId AS target, [r IN relationships(p) | type(r)] AS relTypes;

# 6)
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = shortestPath((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops;

# 7)
MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = allShortestPaths((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops;

# 8)
MATCH p = (s:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(downstream:Supplier)
RETURN downstream.supplierId AS downstreamSupplier, length(p) AS hops
ORDER BY hops, downstreamSupplier;

# 9) Conceptual:
# Upper bounds constrain expansion and keep path search tractable.

# 10) Conceptual:
# allShortestPaths returns all equal-length minimal routes; shortestPath returns one minimal route.
