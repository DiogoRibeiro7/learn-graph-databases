# Exercises

1. Return all orders placed by a specific customer.
2. Return all credit cards used by more than one order.
3. Return all IP addresses connected to more than one customer.
4. Write one query using `WHERE`.
5. Explain when you would use `MERGE` instead of `CREATE`.
6. Write one query using `CREATE` and one query using `MERGE`.

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
