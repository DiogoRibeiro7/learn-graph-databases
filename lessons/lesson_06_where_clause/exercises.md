# Exercises

1. Return all orders with `totalAmount` greater than 150.
2. Return customers from Portugal or Spain who placed at least one non-cancelled order.
3. Return all people whose names start with `Jo`.
4. Return all movies whose titles contain the word `Graph`.
5. Return users whose email ends with `@example.com` using regex.
6. Return customers that have at least one order above 300 using an existential subquery.
7. Return customers that have no orders using `NOT EXISTS { ... }`.
8. Write a filter using `AND`, `OR`, and `NOT` together.
9. Write a query that checks for non-null `status` and returns flagged orders.
10. Explain when `EXISTS { ... }` is better than pattern-only filtering.

# Answers

1. Example answer:

```cypher
MATCH (o:Order)
WHERE o.totalAmount > 150
RETURN o.orderId, o.totalAmount
ORDER BY o.totalAmount DESC
```

2. Example answer:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country IN ["Portugal", "Spain"] AND o.status <> "CANCELLED"
RETURN c.name, o.orderId, o.status
ORDER BY c.name, o.orderId
```

3. Example answer:

```cypher
MATCH (p:Person)
WHERE p.name STARTS WITH "Jo"
RETURN p.name
ORDER BY p.name
```

4. Example answer:

```cypher
MATCH (m:Movie)
WHERE m.title CONTAINS "Graph"
RETURN m.title
ORDER BY m.title
```

5. Example answer:

```cypher
MATCH (u:User)
WHERE u.email =~ "(?i).+@example\\.com"
RETURN u.username, u.email
ORDER BY u.username
```

6. Example answer:

```cypher
MATCH (c:Customer)
WHERE EXISTS {
  MATCH (c)-[:PLACED]->(o:Order)
  WHERE o.totalAmount > 300
}
RETURN c.name
ORDER BY c.name
```

7. Example answer:

```cypher
MATCH (c:Customer)
WHERE NOT EXISTS {
  MATCH (c)-[:PLACED]->(:Order)
}
RETURN c.name
ORDER BY c.name
```

8. Example answer:

```cypher
MATCH (o:Order)
WHERE (o.status = "FLAGGED" OR o.status = "PENDING_REVIEW")
  AND NOT o.totalAmount < 50
RETURN o.orderId, o.status, o.totalAmount
```

9. Example answer:

```cypher
MATCH (o:Order)
WHERE o.status IS NOT NULL AND o.status = "FLAGGED"
RETURN o.orderId, o.status, o.totalAmount
ORDER BY o.totalAmount DESC
```

10. Answer:

`EXISTS { ... }` is better when the condition depends on the existence of a related pattern with its own local filters, especially when that logic would be awkward or less readable in a single flat pattern.
