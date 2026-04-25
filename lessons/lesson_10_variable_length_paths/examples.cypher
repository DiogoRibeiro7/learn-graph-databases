MATCH (a:Account)-[:TRANSFERRED_TO*1..3]->(b:Account)
RETURN a.accountId AS source, b.accountId AS target
LIMIT 25;

MATCH (a:Account)-[:TRANSFERRED_TO*2..2]->(b:Account)
RETURN a.accountId AS source, b.accountId AS twoHopTarget
LIMIT 25;

MATCH p = (a:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(b:Account)
RETURN b.accountId AS target,
       length(p) AS hops,
       [n IN nodes(p) | n.accountId] AS accountChain
ORDER BY hops, target;

MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = shortestPath((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops;

MATCH (start:Account {accountId: "A1"}), (end:Account {accountId: "A8"})
MATCH p = allShortestPaths((start)-[:TRANSFERRED_TO*..6]->(end))
RETURN p, length(p) AS hops;

MATCH p = (src:Account {accountId: "A1"})-[:TRANSFERRED_TO*1..4]->(dst:Account)
WHERE src <> dst
RETURN dst.accountId AS suspiciousTarget,
       length(p) AS chainLength,
       [n IN nodes(p) | n.accountId] AS pathAccounts
ORDER BY chainLength, suspiciousTarget;

MATCH p = (s:Supplier {supplierId: "S1"})-[:SUPPLIES_TO*1..3]->(critical:Supplier)
RETURN critical.supplierId AS downstreamSupplier,
       length(p) AS hops,
       [r IN relationships(p) | type(r)] AS relTypes
ORDER BY hops, downstreamSupplier;

MATCH p = (c:Customer)-[:REFERRED_BY*1..3]->(referrer:Customer)
RETURN c.name AS customer, referrer.name AS upstreamReferrer, length(p) AS levelsUp
ORDER BY levelsUp, customer;
