MATCH (c:Customer)
RETURN c.name AS customer
ORDER BY customer
LIMIT 10;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId, o.totalAmount AS totalAmount
ORDER BY totalAmount DESC;

MATCH p = (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
RETURN c.name AS customer, o.orderId AS orderId, ip.value AS ipAddress, length(p) AS hops
ORDER BY hops DESC, customer;

MATCH (c:Customer)-[:PLACED]->(o:Order)
MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name AS customer, o.orderId AS orderId, cc.cardHash AS card
ORDER BY customer, orderId;

MATCH (c:Customer)
OPTIONAL MATCH (c)-[:REFERRED_BY]->(referrer:Customer)
RETURN c.name AS customer, referrer.name AS referrer
ORDER BY customer;

MATCH (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
WITH c, ip, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, ip.value AS ipAddress, orderCount
ORDER BY orderCount DESC, customer;

MATCH (c:Customer {name: "Alice"})-[:PLACED]->(o:Order)
OPTIONAL MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN o.orderId AS orderId, cc.cardHash AS paymentCard
ORDER BY orderId;

MATCH p = (:Customer {name: "Alice"})-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN ip.value AS ipAddress, length(p) AS pathLength, nodes(p) AS matchedNodes;
