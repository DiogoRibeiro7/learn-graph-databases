# Cypher basics

Cypher is a graph query language designed around graph patterns.

## Common commands

- `MATCH` finds patterns in the graph
- `WHERE` filters which results are returned
- `RETURN` selects the values you want from the query
- `CREATE` creates nodes or relationships
- `MERGE` creates if missing, or matches if already present

## MATCH

`MATCH` describes the graph pattern you want to find. Nodes are wrapped in parentheses and relationships are wrapped in square brackets.

Example:

```cypher
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
RETURN p, c
```

This finds every person who works at a company.

## WHERE

`WHERE` adds filtering logic to a matched pattern. It works like a condition on the nodes or relationships you already matched.

Example:

```cypher
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WHERE c.name = "Acme"
RETURN p.name
```

This returns only people working at Acme.

## RETURN

`RETURN` controls the shape of the query result. You can return nodes, properties, expressions, and aggregations.

Example:

```cypher
MATCH (m:Movie)<-[:ACTED_IN]-(a:Person)
RETURN a.name, count(m) AS movieCount
ORDER BY movieCount DESC
```

This returns actor names and the number of movies they acted in.

## CREATE

`CREATE` adds new nodes or relationships to the graph. Use it when you are sure the data does not already exist.

Example:

```cypher
CREATE (p:Person {name: "Alice", born: 1985})
```

This creates a new person node with a name and birth year.

## MERGE

`MERGE` ensures a pattern exists. If the pattern is already present, it does not create a duplicate. If it is missing, it creates it.

Example:

```cypher
MERGE (p:Person {name: "Alice"})
MERGE (m:Movie {title: "The Matrix"})
MERGE (p)-[:ACTED_IN]->(m)
```

Use `MERGE` when you want to create data only if it is not already present.

## Why this matters

The shape of the query resembles the shape of the graph. That makes Cypher easier to read and easier to map back to a real model.

Use `MATCH` to describe the pattern, `WHERE` to narrow it, and `RETURN` to decide what values should be produced.
