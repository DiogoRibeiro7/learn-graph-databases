# Exercise answers for Lesson 07

# 1)
MATCH (c:Customer)
RETURN c.name AS customer, c.country AS country
ORDER BY customer;

# 2)
MATCH (o:Order)
RETURN o.orderId AS orderId, o.totalAmount AS totalAmount
ORDER BY totalAmount DESC, orderId ASC;

# 3)
MATCH (m:Movie)
RETURN m.title AS title, m.released AS year
ORDER BY year DESC, title ASC
SKIP 10
LIMIT 10;

# 4)
MATCH (:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN DISTINCT ip.value AS ipAddress
ORDER BY ipAddress;

# 5)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(DISTINCT o.orderId) AS distinctOrders
ORDER BY distinctOrders DESC, customer;

# 6)
MATCH (m:Movie)
RETURN m { .title, .released } AS movie
ORDER BY movie.title;

# 7)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
RETURN c { .name, .country, orderCount: orderCount } AS customerSummary
ORDER BY customerSummary.orderCount DESC;

# 8) full nodes
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c, o
LIMIT 10;

# 8) properties only
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId
LIMIT 10;

# 9) Conceptual:
# Avoid DISTINCT when duplicates represent real repeated events that must be preserved for counting.

# 10)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c {
  .name,
  lastOrder: o { .orderId, .totalAmount, .status }
} AS customerOrderView
LIMIT 10;
