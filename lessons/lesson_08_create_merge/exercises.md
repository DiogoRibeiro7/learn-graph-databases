# Exercises

1. Create a new `Customer` and `Order` connected by `PLACED` using `CREATE`.
2. Write a `MERGE` query for customer `C010` with `ON CREATE SET` for `createdAt`.
3. Extend the previous query with `ON MATCH SET` for `lastSeenAt`.
4. Write an idempotent query to ensure order `O9001` exists.
5. Create or match a `PLACED` relationship between customer `C010` and order `O9001`.
6. Show one bad `MERGE` example that could create duplicates and rewrite it correctly.
7. Write an `UNWIND` + `MERGE` import for three customers.
8. Explain when `CREATE` is better than `MERGE`.
9. Explain one Cartesian-product write risk and how to avoid it.
10. Write a verification query that proves a repeated seed run did not duplicate customers.

# Answers

1. Example answer:

```cypher
CREATE (c:Customer {customerId: "C010", name: "Diana", country: "USA"})
CREATE (o:Order {orderId: "O9001", totalAmount: 220, status: "PLACED"})
CREATE (c)-[:PLACED]->(o)
```

2. Example answer:

```cypher
MERGE (c:Customer {customerId: "C010"})
ON CREATE SET c.name = "Diana", c.country = "USA", c.createdAt = datetime()
```

3. Example answer:

```cypher
MERGE (c:Customer {customerId: "C010"})
ON CREATE SET c.name = "Diana", c.country = "USA", c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime()
```

4. Example answer:

```cypher
MERGE (o:Order {orderId: "O9001"})
ON CREATE SET o.totalAmount = 220, o.status = "PLACED"
```

5. Example answer:

```cypher
MERGE (c:Customer {customerId: "C010"})
MERGE (o:Order {orderId: "O9001"})
MERGE (c)-[:PLACED]->(o)
```

6. Example answer:

Bad:

```cypher
MERGE (c:Customer {customerId: "C010", updatedAt: datetime()})
```

Better:

```cypher
MERGE (c:Customer {customerId: "C010"})
SET c.updatedAt = datetime()
```

7. Example answer:

```cypher
UNWIND [
  {customerId: "C010", name: "Diana", country: "USA"},
  {customerId: "C011", name: "Evan", country: "Portugal"},
  {customerId: "C012", name: "Fatima", country: "Spain"}
] AS row
MERGE (c:Customer {customerId: row.customerId})
ON CREATE SET c.name = row.name, c.country = row.country, c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime()
```

8. Answer:

`CREATE` is better for append-only event data where each write should produce a new record, even if similar rows already exist.

9. Answer:

`MATCH (c:Customer), (o:Order) CREATE (c)-[:PLACED]->(o)` creates all combinations. Avoid this by matching specific pairs with identifiers before creating relationships.

10. Example answer:

```cypher
MATCH (c:Customer)
RETURN c.customerId AS customerId, count(*) AS copies
ORDER BY copies DESC, customerId
```
