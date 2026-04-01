# Lesson 03 - Cypher basics

## Concept

Cypher lets you express graph patterns directly.

## Core commands

- `MATCH`
- `WHERE`
- `RETURN`
- `CREATE`
- `MERGE`

## Example

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name, count(o) AS orderCount
```

## Why it matters

This style of query keeps the graph structure visible in the query itself.

## Common mistakes

- confusing `CREATE` and `MERGE`
- forgetting direction when it matters
- returning large patterns without filtering
