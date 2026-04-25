# Exercises

1. Return all customers and their countries, aliasing columns as `customer` and `country`.
2. Return orders sorted by `totalAmount` descending, then by `orderId`.
3. Return the second page of 10 movies using `ORDER BY`, `SKIP`, and `LIMIT`.
4. Return distinct IP addresses used by orders.
5. Return each customer with a distinct order count.
6. Return a map projection for movies with only `title` and `released`.
7. Return a map projection for customers including computed `orderCount`.
8. Return one query that exposes full nodes and another that exposes only properties.
9. Explain when `DISTINCT` should not be used.
10. Create a nested map projection with customer and last order fields.

# Answers

1. Example answer:

```cypher
MATCH (c:Customer)
RETURN c.name AS customer, c.country AS country
ORDER BY customer
```

2. Example answer:

```cypher
MATCH (o:Order)
RETURN o.orderId AS orderId, o.totalAmount AS totalAmount
ORDER BY totalAmount DESC, orderId ASC
```

3. Example answer:

```cypher
MATCH (m:Movie)
RETURN m.title AS title, m.released AS year
ORDER BY year DESC, title ASC
SKIP 10
LIMIT 10
```

4. Example answer:

```cypher
MATCH (:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
RETURN DISTINCT ip.value AS ipAddress
ORDER BY ipAddress
```

5. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(DISTINCT o.orderId) AS distinctOrders
ORDER BY distinctOrders DESC, customer
```

6. Example answer:

```cypher
MATCH (m:Movie)
RETURN m { .title, .released } AS movie
ORDER BY movie.title
```

7. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
RETURN c { .name, .country, orderCount: orderCount } AS customerSummary
ORDER BY customerSummary.orderCount DESC
```

8. Example answer:

Full nodes:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c, o
LIMIT 10
```

Properties only:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, o.orderId AS orderId
LIMIT 10
```

9. Answer:

Do not use `DISTINCT` when duplicate rows represent meaningful events, such as repeated purchases or repeated interactions that you intend to count.

10. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c {
  .name,
  lastOrder: o { .orderId, .totalAmount, .status }
} AS customerOrderView
LIMIT 10
```
