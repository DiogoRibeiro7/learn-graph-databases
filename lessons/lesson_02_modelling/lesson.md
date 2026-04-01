# Lesson 02 - Graph modelling

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

## Common mistakes

- weak relationship naming
- over-normalising the graph
- storing important shared entities as plain strings
