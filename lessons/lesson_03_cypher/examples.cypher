MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, count(o) AS orderCount
ORDER BY orderCount DESC;

MATCH (o:Order)-[:FROM_IP]->(ip:IP)
WHERE ip.value = "192.168.1.10"
RETURN o.orderId;

MATCH (c:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, cc.cardHash;
