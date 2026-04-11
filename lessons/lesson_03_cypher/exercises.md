# Exercises

1. Return all orders placed by a specific customer.
2. Return all credit cards used by more than one order.
3. Return all IP addresses connected to more than one customer.
4. Write one query using `WHERE`.
5. Explain when you would use `MERGE` instead of `CREATE`.
6. Write one query using `CREATE` and one query using `MERGE`.
7. Write a query using `WITH` to return customers who placed more than one order.
8. Write a query using `UNWIND` to create or match multiple genres from a list.
9. Write a query using `UNION` to combine movie titles from two genres.
10. Write a query using `UNION ALL` when duplicates matter.
11. Write a query using `FOREACH` to set a property on a genre node when a condition is true.
12. Write a query using aggregation to return customer order counts and total amount spent.
13. Write a `MERGE` query that uses `ON CREATE` and `ON MATCH` to set different timestamps.
14. Write a variable-length path query that matches up to two `PLACED` relationships.

# Answers

1. Example answer:

```cypher
MATCH (c:Customer {name: "Alice"})-[:PLACED]->(o:Order)
RETURN o.orderId, o.totalAmount
```

2. Example answer:

```cypher
MATCH (o:Order)-[:PAID_WITH]->(cc:CreditCard)
WITH cc, count(o) AS orderCount
WHERE orderCount > 1
RETURN cc.cardHash, orderCount
```

3. Example answer:

```cypher
MATCH (ip:IP)<-[:FROM_IP]-(o:Order)<-[:PLACED]-(c:Customer)
WITH ip, collect(DISTINCT c) AS customers
WHERE size(customers) > 1
RETURN ip.value, size(customers) AS customerCount
```

4. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE o.totalAmount > 100
RETURN c.name, o.orderId, o.totalAmount
```

5. Answer:

Use `MERGE` when you want to ensure a node or relationship exists without creating duplicates. Use `CREATE` when you explicitly want to add a new node or relationship regardless of whether it already exists.

6. Example answers:

```cypher
CREATE (cc:CreditCard {cardHash: "abc123", issuer: "Visa"})
```

```cypher
MERGE (c:Customer {name: "Alice"})
MERGE (o:Order {orderId: "O1002"})
MERGE (c)-[:PLACED]->(o)
```

7. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC
```

8. Example answer:

```cypher
UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName})
```

9. Example answer:

```cypher
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie
```

10. Example answer:

```cypher
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION ALL
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie
```

11. Example answer:

```cypher
UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName})
FOREACH (_ IN CASE WHEN genreName = "Sci-Fi" THEN [1] ELSE [] END |
  SET g.featured = true
)
```

12. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer,
       count(o) AS orderCount,
       sum(o.totalAmount) AS totalSpent
ORDER BY totalSpent DESC
```

13. Example answer:

```cypher
MERGE (c:Customer {name: "Alice"})
ON CREATE SET c.created = timestamp()
ON MATCH SET c.lastSeen = timestamp()
```

14. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED*1..2]->(o:Order)
RETURN c.name, o.orderId
```
