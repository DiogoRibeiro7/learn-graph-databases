# Exercise answers for Lesson 05

# 1)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId
ORDER BY customer, orderId;

# 2)
MATCH (o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN o.orderId AS orderId, cc.cardHash AS card
ORDER BY orderId;

# 3)
MATCH p = (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
RETURN c.name, o.orderId, ip.value, length(p) AS hops;

# 4)
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:REFERRED_BY]->(referrer:Customer)
RETURN c.name AS customer, referrer.name AS referrer
ORDER BY customer;

# 5)
MATCH (c:Customer)-[:PLACED]->(o:Order)
MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, o.orderId, cc.cardHash;

# 6)
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
WITH c, ip, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, ip.value AS ipAddress, orderCount
ORDER BY orderCount DESC;

# 7)
MATCH (o:Order)
OPTIONAL MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN o.orderId AS orderId, cc.cardHash AS card
ORDER BY orderId;

# 8) Conceptual:
# Prefer OPTIONAL MATCH when you must keep base rows even when optional relationships are missing.

# 9)
MATCH p = (:Customer {name: "Alice"})-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN ip.value AS ipAddress, length(p) AS pathLength;

# 10) Cartesian risk and safe rewrite.
MATCH (c:Customer), (o:Order)
RETURN c.name, o.orderId;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, o.orderId;
