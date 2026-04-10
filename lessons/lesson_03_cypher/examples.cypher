MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, count(o) AS orderCount
ORDER BY orderCount DESC;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country = "USA"
RETURN c.name, o.orderId, o.totalAmount
ORDER BY o.totalAmount DESC;

MATCH (o:Order)-[:FROM_IP]->(ip:IP)
WITH ip, count(o) AS orderCount
WHERE orderCount > 1
RETURN ip.value, orderCount;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC;

MATCH (c:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, cc.cardHash;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE o.totalAmount > 100
RETURN c.name AS customer, collect(o.orderId) AS largeOrders
ORDER BY customer;

MATCH (c:Customer)-[:PLACED*1..2]->(o:Order)
RETURN c.name, o.orderId;

UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName});

MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WITH p, collect(m.title) AS movies
UNWIND movies AS movieTitle
RETURN p.name, movieTitle
ORDER BY p.name, movieTitle;

MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie;

UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName})
FOREACH (_ IN CASE WHEN genreName = "Sci-Fi" THEN [1] ELSE [] END |
  SET g.featured = true
);

MATCH (c:Customer {name: "Alice"}), (o:Order {orderId: "O1001"})
MATCH p = shortestPath((c)-[:PLACED*..3]->(o))
RETURN p;

CREATE (c:Customer {name: "Alice", country: "USA"})
CREATE (o:Order {orderId: "O1001", totalAmount: 150})
CREATE (c)-[:PLACED]->(o);

MERGE (c:Customer {name: "Alice"})
MERGE (m:Movie {title: "The Matrix"})
MERGE (c)-[:ACTED_IN]->(m);
