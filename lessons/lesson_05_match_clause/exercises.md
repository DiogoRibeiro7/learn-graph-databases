# Exercises

1. Return all customers and the orders they placed.
2. Return all orders and the credit card used for each order.
3. Write a query that matches a full path from `Customer` to `IP` through `Order`.
4. Return customers and their optional referrer (if any) with `OPTIONAL MATCH`.
5. Write one query using two separate `MATCH` clauses that could also be written as one.
6. Return customers who placed more than one order from the same IP.
7. Write a query that returns `null` for missing payment cards using `OPTIONAL MATCH`.
8. Explain one case where `OPTIONAL MATCH` is preferred over `MATCH`.
9. Write a query that binds a path variable and returns path length.
10. Write one query that would risk a Cartesian product and rewrite it safely.

# Answers

1. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId
ORDER BY customer, orderId
```

2. Example answer:

```cypher
MATCH (o:Order)-[:PAID_WITH]->(cc:CreditCard)
RETURN o.orderId AS orderId, cc.cardHash AS card
ORDER BY orderId
```

3. Example answer:

```cypher
MATCH p = (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
RETURN c.name, o.orderId, ip.value, length(p) AS hops
```

4. Example answer:

```cypher
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:REFERRED_BY]->(referrer:Customer)
RETURN c.name AS customer, referrer.name AS referrer
ORDER BY customer
```

5. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN c.name, o.orderId, cc.cardHash
```

6. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:FROM_IP]->(ip:IP)
WITH c, ip, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, ip.value AS ipAddress, orderCount
ORDER BY orderCount DESC
```

7. Example answer:

```cypher
MATCH (o:Order)
OPTIONAL MATCH (o)-[:PAID_WITH]->(cc:CreditCard)
RETURN o.orderId AS orderId, cc.cardHash AS card
ORDER BY orderId
```

8. Answer:

Use `OPTIONAL MATCH` when you need to keep base rows even when a relationship may not exist, such as reporting all customers including those without referrers.

9. Example answer:

```cypher
MATCH p = (:Customer {name: "Alice"})-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN ip.value AS ipAddress, length(p) AS pathLength
```

10. Example answer:

Unsafe (disconnected patterns):

```cypher
MATCH (c:Customer), (o:Order)
RETURN c.name, o.orderId
```

Safer rewrite:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, o.orderId
```
