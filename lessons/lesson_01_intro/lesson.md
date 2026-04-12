# Lesson 01 - Introduction to graph databases

## What you'll learn

- What a graph database is and how it differs from relational storage
- How nodes, relationships, and properties represent data
- How to create a simple graph using Cypher

## Prerequisites

None — this lesson is the starting point for the course.

## Concept

A graph database stores entities and their relationships directly.

## Why it matters

Many real problems are not just about storing objects. They are about traversing connections between objects.

Examples:

- Which customers share an IP address?
- Which products were bought together?
- Which suppliers affect this factory?
- Which people are connected through two intermediaries?

## Small example

```cypher
CREATE (:Person {name: "Ana"});
CREATE (:Person {name: "Bruno"});
MATCH (a:Person {name: "Ana"}), (b:Person {name: "Bruno"})
CREATE (a)-[:KNOWS]->(b);
```

## What to notice

- `Person` is a node label
- `KNOWS` is a relationship type
- `name` is a property

## Common mistakes

- thinking only in tables
- ignoring relationships as first-class data
- making the graph more complex than necessary
