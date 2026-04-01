# Cypher basics

Cypher is a graph query language designed around graph patterns.

## Common commands

- `MATCH` finds patterns
- `WHERE` filters results
- `RETURN` returns values
- `CREATE` creates nodes or relationships
- `MERGE` creates if missing, or matches if already present

## Example

```cypher
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WHERE c.name = "Acme"
RETURN p.name
```

The shape of the query resembles the shape of the graph.

That is one of the main reasons Cypher is easy to teach.
