# Graph Algorithms Overview

Graph algorithms help answer questions about structure, connections, and influence in graphs.
They are a key part of graph analytics and can be used with Neo4j's Cypher queries or the Graph Data Science (GDS) library.

## Common categories of graph algorithms

### Traversal and search

- **Breadth-first search (BFS)** and **depth-first search (DFS)**
- Find reachable nodes, patterns, and connected components
- Useful for exploring a neighborhood or discovering connected data

### Pathfinding

- **Shortest path** algorithms for the least-cost route
- Example: `shortestPath()` in Cypher
- Use cases: logistics, route planning, and impact analysis

### Centrality

Centrality measures identify important or influential nodes.
Common centrality metrics include:

- **Degree centrality**: number of direct connections
- **Betweenness centrality**: nodes that appear on many shortest paths
- **PageRank**: importance based on incoming connections
- **Closeness centrality**: average distance to all other nodes

### Community detection

Community detection groups nodes that are densely connected.
Common algorithms include:

- **Label Propagation**
- **Louvain**
- **Connected components**

Use community detection to find clusters, fraud rings, or customer segments.

### Similarity and embeddings

- Represent nodes as vectors to compare similarity
- Useful for recommendations, entity matching, and semantic search
- Neo4j GDS provides embeddings and similarity algorithms

## When and why to use each category

- Use traversal/search for discovery and relationship exploration.
- Use pathfinding when you need the shortest route or distance between entities.
- Use centrality to identify influential nodes or hubs.
- Use community detection to find clusters and group behavior.
- Use similarity and embeddings for recommendation and matching problems.

## Relationship to Neo4j GDS

Neo4j GDS provides a library of graph algorithms that scales beyond simple Cypher queries.
It is especially useful when you need:

- performance on large graph structures
- advanced algorithm variants
- embedding or machine learning workflows

In this repo, Cypher is used for basic examples and graph algorithm teaching.
GDS is a natural next step for advanced analytics and production-grade graph science.

## Example patterns

### Shortest path in Cypher

```cypher
MATCH (a:Customer {name: "Ana"}), (b:Customer {name: "Bruno"})
MATCH p = shortestPath((a)-[:PLACED*..4]-(b))
RETURN p
```

### Degree centrality with Cypher

```cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN p.name AS actor, count(m) AS movieCount
ORDER BY movieCount DESC
```

### Community-like pattern

```cypher
MATCH (a:Customer)-[:PLACED]->(:Order)<-[:PLACED]-(b:Customer)
RETURN a.name, b.name, count(*) AS sharedOrders
ORDER BY sharedOrders DESC
```

## Practical takeaway

Graph algorithms make graphs more than just data storage.
They reveal structure, influence, similarity, and hidden patterns that are difficult to express with ordinary tabular queries.
