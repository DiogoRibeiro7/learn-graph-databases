# Lesson 03 - Cypher basics

## Concept

Cypher lets you express graph patterns directly.

## MATCH

`MATCH` is the heart of most Cypher queries. It describes the nodes and relationships you want to find.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c, o
```

This finds each customer and the orders they placed.

## WHERE

Use `WHERE` when you need to filter the matched data.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country = "USA"
RETURN c.name, o.orderId
```

That returns only orders placed by customers in the USA.

## RETURN

`RETURN` controls what the query outputs. You can return node properties, counts, or computed values.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, count(o) AS orderCount
ORDER BY orderCount DESC
```

This returns each customer and how many orders they placed.

## CREATE

`CREATE` adds new nodes or relationships to the graph. Use it when you want to add new data and you know it does not already exist.

Example:

```cypher
CREATE (c:Customer {name: "Alice", country: "USA"})
```

This creates a new customer node.

## MERGE

`MERGE` ensures a pattern exists without creating duplicates. If the node or relationship already exists, it uses the existing one. If not, it creates it.

Example:

```cypher
MERGE (c:Customer {name: "Alice"})
MERGE (o:Order {orderId: "O1001"})
MERGE (c)-[:PLACED]->(o)
```

Use `MERGE` for idempotent writes when you want to avoid duplicate nodes or relationships.

## Why it matters

This style of query keeps the graph structure visible in the query itself.

The graph pattern appears as a mini-graph sequence, and the query reads like a traversal.

## Common mistakes

- confusing `CREATE` and `MERGE`
- forgetting direction when it matters
- returning large patterns without filtering
- using `WHERE` before `MATCH`
- returning nodes when you only need properties
