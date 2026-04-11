# SPARQL Overview

SPARQL is the query language for RDF data. It allows you to express graph patterns and retrieve or construct data from RDF triples.

## Query forms

SPARQL defines four main query forms:

- `SELECT` — returns variable bindings, similar to SQL.
- `CONSTRUCT` — builds a new RDF graph from query results.
- `ASK` — returns a boolean indicating if a query pattern exists.
- `DESCRIBE` — returns a RDF graph describing resources.

### SELECT

The most common SPARQL query form is `SELECT`.

```sparql
PREFIX schema: <http://schema.org/>

SELECT ?movie ?title
WHERE {
  ?movie a schema:Movie ;
         schema:name ?title .
}
```

This query matches all RDF triples where a resource is a `schema:Movie` and has a `schema:name`.

### CONSTRUCT

`CONSTRUCT` creates a new graph from matching triples:

```sparql
PREFIX schema: <http://schema.org/>

CONSTRUCT {
  ?movie schema:hasTitle ?title .
}
WHERE {
  ?movie a schema:Movie ;
         schema:name ?title .
}
```

### ASK

`ASK` returns `true` or `false` depending on whether the pattern exists.

```sparql
PREFIX schema: <http://schema.org/>

ASK {
  ?movie a schema:Movie ;
         schema:name "Signal at Midnight" .
}
```

### DESCRIBE

`DESCRIBE` returns a graph describing matched resources.

```sparql
PREFIX schema: <http://schema.org/>

DESCRIBE <http://example.org/movie/1>
```

## Triple patterns and graph patterns

SPARQL queries are built from triple patterns. Blank nodes and variables are commonly used:

```sparql
?person schema:actedIn ?movie .
```

A `WHERE` clause can contain multiple patterns, optional patterns, filters, and unions.

## FILTER, OPTIONAL, UNION

### FILTER

`FILTER` applies constraints to variable values.

```sparql
FILTER (?year > 2020)
```

### OPTIONAL

`OPTIONAL` adds an optional pattern to the query, similar to a left join.

```sparql
OPTIONAL {
  ?movie schema:genre ?genre .
}
```

### UNION

`UNION` combines alternative graph patterns.

```sparql
{
  ?movie schema:genre "Drama" .
}
UNION
{
  ?movie schema:genre "Mystery" .
}
```

## Comparison with Cypher

Both SPARQL and Cypher query graphs, but they target different graph models:

- **SPARQL** is designed for RDF triples and semantic graph querying.
- **Cypher** is designed for property graphs and expressive path traversal.

### Similarities

- Both use pattern matching to express graph queries.
- Both support filtering, optional matches, and unions.

### Differences

- SPARQL operates over RDF triples and variables in triple patterns.
- Cypher uses node and relationship patterns with labels and properties.
- SPARQL has query forms like `ASK`, `CONSTRUCT`, and `DESCRIBE`.
- Cypher focuses on returning tabular or graph-shaped results from property graphs.

## When use SPARQL?

Use SPARQL when you need to query RDF data, work with linked data, or leverage semantic vocabularies and ontologies.
Use Cypher when you are working with property graph databases like Neo4j and need rich graph traversals and path operations.
