# Graph vs relational thinking

Relational databases are usually strongest when the data is naturally tabular.

Graph databases are strongest when the structure of the problem is about relationships.

## Relational model

A relational system often stores:

- users
- products
- orders
- order items

This is a strong fit for reporting, transactions, and structured business records.

## Graph model

A graph system often stores:

- users
- products
- devices
- cards
- addresses
- suppliers
- dependencies

and especially the **connections** between them.

## The key difference

In SQL, relationships are usually reconstructed by joins.

In graph databases, relationships are directly traversed.

## A useful rule

If your common questions sound like these, graph thinking may help:

- find all neighbours
- find all things within 2 hops
- find shortest path
- find connected components
- find shared identifiers
- trace dependencies

## Warning

A graph database is not automatically better. If the problem is mostly simple CRUD and tabular reporting, a relational database is often the better choice.
