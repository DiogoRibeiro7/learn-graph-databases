MATCH (c:Customer)-[r:PLACED]->(o:Order)
RETURN c, r, o
LIMIT 5;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId, o.totalAmount AS amount
ORDER BY amount DESC;

MATCH (m:Movie)
RETURN m.title AS title, m.released AS year
ORDER BY year DESC, title ASC
SKIP 0
LIMIT 10;

MATCH (:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN DISTINCT ip.value AS ipAddress
ORDER BY ipAddress;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(DISTINCT o.orderId) AS distinctOrders
ORDER BY distinctOrders DESC, customer;

MATCH (m:Movie)
RETURN m { .title, .released } AS movie
ORDER BY movie.title
LIMIT 5;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount, sum(o.totalAmount) AS totalSpent
RETURN c {
  .name,
  .country,
  orderCount: orderCount,
  totalSpent: totalSpent
} AS customerSummary
ORDER BY customerSummary.totalSpent DESC;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c {
  .name,
  lastOrder: o { .orderId, .totalAmount, .status }
} AS customerOrderView
LIMIT 10;
