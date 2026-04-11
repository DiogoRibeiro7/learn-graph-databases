# Property Graphs vs RDF

This document compares the two common graph data models: property graphs and RDF.
Use this guide to understand their differences, tooling, and when to choose each approach.

## Data model differences

### Property graphs

- Nodes and relationships are first-class entities.
- Both nodes and relationships can carry arbitrary properties.
- Labels are used to group nodes and relationships by type.
- The model is flexible and often easier to model application data.

Example:

```cypher
CREATE (p:Person {name: "Ana"})-[:ACTED_IN {role: "Eva"}]->(m:Movie {title: "Signal at Midnight"})
```

### RDF

- Data is represented as triples: subject, predicate, object.
- All statements are edges in a global graph.
- Properties are represented as predicates and objects.
- Uses URIs and namespaces for interoperability.

Example:

```turtle
<http://example.org/person/Ana> <http://schema.org/name> "Ana" .
<http://example.org/person/Ana> <http://schema.org/actedIn> <http://example.org/movie/1> .
```

## Query language differences

### Cypher

- Designed for property graphs.
- Uses node and relationship patterns.
- Expressive path traversal and aggregation.

Example:

```cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN p.name AS actor, m.title AS movie
```

### SPARQL

- Designed for RDF triples.
- Uses graph patterns over subjects, predicates, and objects.
- Supports multiple query forms: `SELECT`, `CONSTRUCT`, `ASK`, `DESCRIBE`.

Example:

```sparql
PREFIX schema: <http://schema.org/>

SELECT ?actor ?movie
WHERE {
  ?actor schema:actedIn ?movie .
  ?actor schema:name ?actorName .
}
```

## Tooling ecosystem

### Property graphs

- Neo4j, Amazon Neptune, RedisGraph, Memgraph.
- Cypher, Gremlin, openCypher.
- Strong support for graph analytics, path queries, and application development.

### RDF

- Apache Jena, Blazegraph, GraphDB, Stardog.
- SPARQL query language.
- Standard vocabularies, ontologies, and linked-data tooling.

## When to choose which approach

### Choose property graphs when:

- Your data is application-oriented and centered around entities and relationships.
- You need rich properties on both nodes and relationships.
- You want intuitive graph traversal and analytics in a graph database like Neo4j.
- You prefer a simpler modeling experience for domain data.

### Choose RDF when:

- You need semantic interoperability and linked data.
- You work with standard vocabularies and ontologies.
- You need RDF serialization formats like Turtle or JSON-LD.
- You want query flexibility across datasets using SPARQL.

## Strengths and trade-offs

| Feature | Property Graph | RDF |
| --- | --- | --- |
| Model simplicity | High for application graphs | Higher learning curve due to triples and URIs |
| Property support on relationships | Native | Represented as additional triples |
| Standardization | Less standardized across systems | Highly standardized (RDF/SPARQL) |
| Semantic reasoning | Limited unless added separately | Built for ontologies and reasoning |
| Tool interoperability | Good within property graph ecosystems | Excellent for linked data networks |

## Summary

Property graphs and RDF are both powerful graph models.
The best choice depends on whether you value application-focused graph traversal and properties,
or semantic interoperability and standard vocabularies.
