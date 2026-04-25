MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC, customer;

MATCH (:Customer)-[:PLACED]->(o:Order)
RETURN sum(o.totalAmount) AS totalRevenue,
       avg(o.totalAmount) AS avgOrderValue,
       min(o.totalAmount) AS minOrderValue,
       max(o.totalAmount) AS maxOrderValue;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, collect(o.orderId) AS orderIds
ORDER BY customer;

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.country AS country, count(o) AS orderCount
ORDER BY orderCount DESC, country;

MATCH (c:Customer)
OPTIONAL MATCH (c)-[:PLACED]->(o:Order)
RETURN c.name AS customer,
       count(*) AS rowCount,
       count(o) AS nonNullOrders
ORDER BY customer;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount, sum(o.totalAmount) AS totalSpent
WHERE orderCount >= 2
RETURN c.name AS customer, orderCount, totalSpent
ORDER BY totalSpent DESC;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, collect(o.orderId) AS orderIds
UNWIND orderIds AS orderId
RETURN c.name AS customer, orderId
ORDER BY customer, orderId;

MATCH (o:Order)-[:FROM_IP]->(ip:IP)
WITH ip, count(o) AS orderCount, collect(o.orderId) AS suspiciousOrders
WHERE orderCount > 1
RETURN ip.value AS ipAddress, orderCount, suspiciousOrders
ORDER BY orderCount DESC, ipAddress;
