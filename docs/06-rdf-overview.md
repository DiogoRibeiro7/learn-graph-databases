# RDF Overview

The Resource Description Framework (RDF) is a standard model for representing knowledge as a graph of statements.
Each statement is a triple made of a subject, predicate, and object.

## RDF triples

An RDF triple has three parts:

- **Subject**: the resource being described
- **Predicate**: the property or relationship
- **Object**: the value or another resource

Example:

```turtle
<http://example.org/person/Ana> <http://schema.org/name> "Ana" .
```

This triple says that the resource `http://example.org/person/Ana` has a `name` of `Ana`.

## URIs and namespaces

RDF uses URIs to identify resources and predicates unambiguously.
Namespaces make URIs easier to read by introducing prefixes:

```turtle
@prefix ex: <http://example.org/> .
@prefix schema: <http://schema.org/> .

ex:personA schema:name "Ana" .
```

Namespaces are critical for combining data from different sources without collisions.

## RDF serialization formats

RDF data can be written in several formats. Common examples include:

- **Turtle**: a compact, human-readable text format.
- **JSON-LD**: a JSON-based format suitable for web applications.
- **N-Triples**: a simple line-based format ideal for streaming and debugging.

Example Turtle:

```turtle
@prefix schema: <http://schema.org/> .

<http://example.org/movie/1>
  a schema:Movie ;
  schema:name "Signal at Midnight" ;
  schema:director <http://example.org/person/Carla> .
```

Example JSON-LD:

```json
{
  "@context": {
    "schema": "http://schema.org/"
  },
  "@id": "http://example.org/movie/1",
  "@type": "schema:Movie",
  "schema:name": "Signal at Midnight",
  "schema:director": {
    "@id": "http://example.org/person/Carla"
  }
}
```

## When to use RDF vs property graphs

RDF and property graphs are both graph-based models, but they serve different use cases.

Use RDF when:

- you need a standard semantic data model for knowledge graphs
- you want to integrate data from many sources with shared vocabularies
- you require strong support for ontologies, reasoning, or linked data
- you need a web-friendly serialization like JSON-LD

Use property graphs when:

- your data is centered on connected entities and relationships
- you prefer a simpler, property-rich graph model for analytics
- you need fast traversal queries with property graph query languages like Cypher
- you are working with graph databases such as Neo4j in a schema-flexible way

## RDF in the context of graph databases

RDF emphasizes subject-predicate-object triples and interoperable vocabularies.
Property graphs emphasize nodes, relationships, and properties on both elements.

Both models are graph-shaped, but RDF is often the best choice for semantic web,
linked data, and cases where standard vocabulary reuse is important.
Property graphs are typically easier to use for application-centric graph modeling and traversal.
