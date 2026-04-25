# Exercises

1. Return each customer with their number of orders.
2. Return total, average, minimum, and maximum order amount.
3. Return each customer with a list of their order IDs.
4. Group orders by country and return order counts.
5. Write a query that shows `COUNT(*)` and `COUNT(o)` side by side.
6. Return only customers with at least two orders using `WITH`.
7. Return customers ordered by total amount spent (descending).
8. Use `COLLECT` and `UNWIND` in one query pipeline.
9. Return IP addresses linked to more than one order with the related order IDs.
10. Explain one risk of collecting very large lists.

# Answers

1. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC, customer
```

2. Example answer:

```cypher
MATCH (:Customer)-[:PLACED]->(o:Order)
RETURN sum(o.totalAmount) AS totalRevenue,
       avg(o.totalAmount) AS avgOrderValue,
       min(o.totalAmount) AS minOrderValue,
       max(o.totalAmount) AS maxOrderValue
```

3. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, collect(o.orderId) AS orderIds
ORDER BY customer
```

4. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.country AS country, count(o) AS orderCount
ORDER BY orderCount DESC, country
```

5. Example answer:

```cypher
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(*) AS rowCount, count(o) AS nonNullOrders
ORDER BY customer
```

6. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount >= 2
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC
```

7. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, sum(o.totalAmount) AS totalSpent
ORDER BY totalSpent DESC
```

8. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, collect(o.orderId) AS orderIds
UNWIND orderIds AS orderId
RETURN c.name AS customer, orderId
ORDER BY customer, orderId
```

9. Example answer:

```cypher
MATCH (o:Order)-[:FROM_IP]->(ip:IP)
WITH ip, count(o) AS orderCount, collect(o.orderId) AS orderIds
WHERE orderCount > 1
RETURN ip.value AS ipAddress, orderCount, orderIds
ORDER BY orderCount DESC
```

10. Answer:

Large `COLLECT` lists can increase memory usage and make queries slower, especially when grouped across high-cardinality dimensions.
