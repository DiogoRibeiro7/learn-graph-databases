/* Shared IP usage across distinct customers */
MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
WITH ip, collect(DISTINCT c.name) AS customers
WHERE size(customers) > 1
RETURN ip.value AS ip, customers, size(customers) AS customerCount
ORDER BY customerCount DESC, ip;

/* Shared credit card usage across orders */
MATCH (:Order)-[:PAID_WITH]->(cc:CreditCard)<-[:PAID_WITH]-(:Order)
WITH cc, count(*) AS usageCount
WHERE usageCount > 1
RETURN cc.cardHash AS cardHash, usageCount
ORDER BY usageCount DESC, cardHash;

/* Suspicious transfer rings: account cycles between 3 and 5 hops */
MATCH p = (a:Account)-[:TRANSFERRED_TO*3..5]->(a)
RETURN a.accountId AS anchorAccount,
       length(p) AS cycleLength,
       [n IN nodes(p) | n.accountId] AS cycleAccounts
ORDER BY cycleLength, anchorAccount
LIMIT 25;

/* Fan-out pattern: many recipients from one account in a short window */
MATCH (src:Account)-[t:TRANSFERRED_TO]->(dst:Account)
WHERE datetime(t.occurredAt) >= datetime("2026-04-01T10:00:00Z")
  AND datetime(t.occurredAt) < datetime("2026-04-01T11:00:00Z")
WITH src, collect(DISTINCT dst.accountId) AS recipients, count(t) AS transferCount, sum(t.amount) AS totalOut
WHERE size(recipients) >= 3
RETURN src.accountId AS sourceAccount, recipients, transferCount, totalOut
ORDER BY transferCount DESC, totalOut DESC;

/* Card velocity: many orders on one card in a tight time span */
MATCH (:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
WITH cc, count(o) AS orderCount, min(datetime(o.placedAt)) AS firstSeen, max(datetime(o.placedAt)) AS lastSeen
WITH cc, orderCount, firstSeen, lastSeen, duration.between(firstSeen, lastSeen) AS span
WHERE orderCount >= 3 AND span.days = 0 AND span.seconds <= 1800
RETURN cc.cardHash AS cardHash, orderCount, firstSeen, lastSeen, span.seconds AS spanSeconds
ORDER BY orderCount DESC, spanSeconds ASC;

/*
  Optional community detection example using Neo4j GDS.
  This assumes GDS is installed.
*/
CALL gds.graph.project(
  'fraudGraph',
  ['Customer', 'Order'],
  {
    PLACED: {orientation: 'UNDIRECTED'}
  }
)
YIELD graphName
CALL gds.wcc.stream('fraudGraph')
YIELD componentId, nodeId
RETURN componentId, gds.util.asNode(nodeId).name AS customer
ORDER BY componentId, customer;
