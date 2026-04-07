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

MATCH (c:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, cc.cardHash;
