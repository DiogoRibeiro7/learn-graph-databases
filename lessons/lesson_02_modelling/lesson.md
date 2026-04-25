# Lesson 02 - Graph modelling

## What you'll learn

- How to turn domain questions into a graph model
- When to use nodes versus properties
- How relationships express meaningful connections

## Prerequisites

- Lesson 01: Introduction to graph databases

## Concept

Graph modelling begins with domain questions.

## Why it matters

A bad model makes even a good database hard to use.

## Example domain

E-commerce fraud.

Possible nodes:

- `Customer`
- `Order`
- `CreditCard`
- `Address`
- `IP`

Possible relationships:

- `(:Customer)-[:PLACED]->(:Order)`
- `(:Order)-[:PAID_WITH]->(:CreditCard)`
- `(:Order)-[:SHIPPED_TO]->(:Address)`
- `(:Order)-[:FROM_IP]->(:IP)`

## Key question

Why might `Address` be a node instead of a property?

Because it can be shared, queried, and traversed.

## Practical example

This modelling lesson is grounded in the fraud example domain. The `examples/fraud/` folder contains the schema, seed data, and queries used to explore the model in practice.

## Common mistakes

- weak relationship naming
- over-normalising the graph
- storing important shared entities as plain strings

## Summary

This lesson covered graph modelling, including how to choose nodes, relationships, and shared entities. You learned why the same domain can be modelled differently and how a good model supports queries.

## What's next

Continue to Lesson 03 to learn how to query graph models using Cypher and explore the data you modelled.


## Diagram

See ../../assets/diagrams/lessons/lesson_02_modelling.mmd for a companion Mermaid diagram.
