# Graph modelling

Graph modelling is not just about translating tables into nodes.

It starts with questions.

## Ask these first

1. What are the key entities?
2. What are the key relationships?
3. Which paths matter?
4. What will users ask repeatedly?
5. Which things deserve their own identity?

## Node vs property

A thing should usually be a **node** if:

- it has identity
- it participates in several relationships
- you want to query it directly

A thing should usually be a **property** if:

- it only describes something else
- it is not queried independently
- it is not part of traversal logic

## Example

A `Customer` is usually a node.

A `customerName` is usually a property.

An `Address` can be a node if multiple customers or orders connect to it and you care about shared usage.

## Common mistakes

- turning every field into a node
- copying a relational schema without rethinking the domain
- ignoring relationship direction
- creating vague relationship names
