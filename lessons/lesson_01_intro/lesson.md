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

## Practical example

This lesson introduces the graph model used throughout the course. Later lessons use example domains such as the fraud graph and movie graph in `examples/` to apply these concepts.

Use the repo's seed scripts and query runners after completing the course material.

## Common mistakes

- thinking only in tables
- ignoring relationships as first-class data
- making the graph more complex than necessary

## Summary

This lesson introduced the graph database model, including nodes, relationships, and properties. You learned how relationships make connections first-class and how to represent a simple graph with Cypher.

## What's next

Continue to Lesson 02 to learn how to model a domain as a graph and design relationships for real-world questions.
