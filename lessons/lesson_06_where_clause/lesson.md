# Lesson 06 - WHERE clause deep dive

## What you'll learn

- How `WHERE` filters matched graph patterns
- Property comparisons and range filters
- Boolean logic with `AND`, `OR`, and `NOT`
- String matching with `STARTS WITH`, `CONTAINS`, and `ENDS WITH`
- Regular expressions with `=~`
- Existential subqueries with `EXISTS { ... }`

## Prerequisites

- Lesson 03: Cypher basics
- Lesson 05: MATCH clause deep dive

## Why WHERE matters

`MATCH` defines candidate rows. `WHERE` narrows those rows to the records that satisfy business conditions.

Good `WHERE` usage keeps query intent explicit and reduces unnecessary result volume.

## Property comparisons

Basic equality and range filtering:

```cypher
MATCH (o:Order)
WHERE o.status = "SHIPPED" AND o.totalAmount >= 100
RETURN o.orderId, o.status, o.totalAmount
ORDER BY o.totalAmount DESC
```

Membership filtering with `IN`:

```cypher
MATCH (o:Order)
WHERE o.status IN ["SHIPPED", "DELIVERED", "PENDING_REVIEW"]
RETURN o.orderId, o.status
```

Null checks:

```cypher
MATCH (c:Customer)
WHERE c.email IS NOT NULL
RETURN c.name, c.email
```

## Boolean operators

You can compose complex conditions with boolean logic:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE (c.country = "USA" OR c.country = "Canada")
  AND o.totalAmount > 200
  AND NOT o.status = "CANCELLED"
RETURN c.name, o.orderId, o.totalAmount, o.status
```

Use parentheses to make precedence unambiguous.

## String matching

Cypher supports readable string predicates directly:

```cypher
MATCH (p:Person)
WHERE p.name STARTS WITH "Al"
   OR p.name CONTAINS "son"
   OR p.name ENDS WITH "ez"
RETURN p.name
ORDER BY p.name
```

Case-sensitive partial filtering:

```cypher
MATCH (m:Movie)
WHERE m.title CONTAINS "Matrix"
RETURN m.title
```

## Regular expressions

Use `=~` for regex filtering:

```cypher
MATCH (u:User)
WHERE u.email =~ "(?i).+@example\\.com"
RETURN u.username, u.email
```

- `(?i)` makes the match case-insensitive.
- Escape `\` as `\\` inside Cypher strings.

## Existential subqueries

`EXISTS { ... }` checks whether a subquery can find at least one row.

Example: customers that have at least one large order:

```cypher
MATCH (c:Customer)
WHERE EXISTS {
  MATCH (c)-[:PLACED]->(o:Order)
  WHERE o.totalAmount >= 500
}
RETURN c.name
ORDER BY c.name
```

You can also negate it:

```cypher
MATCH (c:Customer)
WHERE NOT EXISTS {
  MATCH (c)-[:PLACED]->(:Order)
}
RETURN c.name AS customersWithoutOrders
```

## Practical guidance

- Keep `WHERE` close to the `MATCH` it filters.
- Prefer explicit parentheses in mixed boolean expressions.
- Start broad, then tighten filters one condition at a time.
- Use `EXPLAIN`/`PROFILE` for heavy regex or subquery usage.

## Common pitfalls

- Writing a `WHERE` condition that references variables not yet introduced
- Forgetting null behavior in comparisons
- Overusing regex when simpler string operators are enough
- Putting highly selective predicates too late in multi-stage queries

## Summary

`WHERE` is the main filter mechanism in Cypher. With property comparisons, boolean logic, string predicates, regex, and existential subqueries, you can express precise retrieval conditions while keeping queries readable and maintainable.
