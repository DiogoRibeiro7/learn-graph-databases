# Exercise answers for Lesson 09

# 1)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC, customer;

# 2)
MATCH (:Customer)-[:PLACED]->(o:Order)
RETURN sum(o.totalAmount) AS totalRevenue,
       avg(o.totalAmount) AS avgOrderValue,
       min(o.totalAmount) AS minOrderValue,
       max(o.totalAmount) AS maxOrderValue;

# 3)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, collect(o.orderId) AS orderIds
ORDER BY customer;

# 4)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.country AS country, count(o) AS orderCount
ORDER BY orderCount DESC, country;

# 5)
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(*) AS rowCount, count(o) AS nonNullOrders
ORDER BY customer;

# 6)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount >= 2
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC;

# 7)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, sum(o.totalAmount) AS totalSpent
ORDER BY totalSpent DESC;

# 8)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, collect(o.orderId) AS orderIds
UNWIND orderIds AS orderId
RETURN c.name AS customer, orderId
ORDER BY customer, orderId;

# 9)
MATCH (o:Order)-[:FROM_IP]->(ip:IP)
WITH ip, count(o) AS orderCount, collect(o.orderId) AS orderIds
WHERE orderCount > 1
RETURN ip.value AS ipAddress, orderCount, orderIds
ORDER BY orderCount DESC;

# 10) Conceptual:
# Very large collected lists may increase memory pressure and query latency.
