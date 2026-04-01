# What is a graph database?

A graph database is a database designed to store and query **relationships** directly.

Instead of treating relationships as something reconstructed later with joins, a graph database stores connected data as a graph made of:

- nodes
- relationships
- properties

## Example

A very small example:

- `(:Person {name: "Ana"})`
- `(:Person {name: "Bruno"})`
- `(:Person {name: "Ana"})-[:KNOWS]->(:Person {name: "Bruno"})`

This means that Ana knows Bruno.

## Why this matters

Graph databases are useful when questions depend on connections such as:

- who is connected to whom
- what depends on what
- what is reachable from here
- how are these two entities related
- what paths exist between these points

## Good application areas

- social networks
- fraud detection
- recommendation systems
- supply chains
- knowledge graphs
- infrastructure dependencies
- access control

## Core idea

A graph database becomes useful when the **connections are central to the problem**, not secondary.
