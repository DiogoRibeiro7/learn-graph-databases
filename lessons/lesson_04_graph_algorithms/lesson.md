# Lesson 04 - Graph algorithms basics

## What you'll learn

- How graph algorithms reveal structure, influence, and connection patterns
- When to use shortest-path and centrality queries
- How simple Cypher can support algorithmic thinking

## Prerequisites

- Lesson 01: Introduction to graph databases
- Lesson 02: Graph modelling
- Lesson 03: Cypher basics

## Concept

Graph algorithms answer questions about how nodes are connected and which nodes are most important.

They help you move beyond individual matches to understand patterns, influence, and paths in the graph.

## Why it matters

Graph algorithms are what make graph databases powerful for recommendations, fraud detection, network analysis, and influence scoring.

Understanding even simple graph algorithm patterns helps you ask better questions of the data.

For a broader overview of graph algorithm categories and when to use them, see `docs/10-graph-algorithms-overview.md`.

## Practical example

Try these graph algorithm concepts with the supply-chain example in `examples/supply-chain/` and the fraud example in `examples/fraud/`. Use `yarn seed:supply` and `yarn query:supply` to explore the practical pathfinding examples, and review the GDS notes for advanced analytics patterns.

## Shortest path

The shortest path is the smallest number of hops between two nodes. Use `shortestPath()` when you want a single best route.

Example:

```cypher
MATCH (a:Customer {name: "Alice"}), (b:Customer {name: "Bruno"})
MATCH p = shortestPath((a)-[:PLACED*..3]-(b))
RETURN p, length(p) AS hops
```

This finds the shortest route between two customers through up to three `PLACED` relationships and returns the hop count.

### Weighted vs unweighted shortest paths

`shortestPath()` only finds the path with the fewest relationships, not the path with the lowest numerical cost.
If relationships carry a numeric weight such as `distance`, `cost`, or `duration`, use a weighted path algorithm instead.

Example using Neo4j Graph Data Science (GDS) Dijkstra:

```cypher
MATCH (source:Supplier {name: "North Metals"}), (target:Supplier {name: "Blue Circuits"})
CALL gds.graph.project(
  'supplyChainGraph',
  ['Supplier', 'Factory', 'Component'],
  {
    SUPPLIES: {orientation: 'UNDIRECTED'},
    USES: {orientation: 'UNDIRECTED'}
  }
)
YIELD graphName
CALL gds.shortestPath.dijkstra.stream('supplyChainGraph', {
  sourceNode: id(source),
  targetNode: id(target),
  relationshipWeightProperty: 'distance'
})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId).name AS name, cost;
```

This computes the least-cost route when relationships have a numeric `distance` or `cost` property.
Use `shortestPath()` for unweighted hop-based routes, and use GDS Dijkstra when weights matter.

## Degree centrality

Degree centrality counts how many relationships a node has. It is a simple measure of importance or activity.

Example:

```cypher
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC
```

Customers with more relationships are often more central in the graph.

## Shared connections

Finding nodes with shared relationships helps identify communities and related entities.

Example:

```cypher
MATCH (c1:Customer)-[:PLACED]->(:Order)<-[:PLACED]-(c2:Customer)
WHERE c1 <> c2
RETURN c1.name AS customerA, c2.name AS customerB, count(*) AS sharedOrders
ORDER BY sharedOrders DESC
```

This shows customers connected by the same orders, which can reveal suspicious or related activity.

## Community detection

Community detection groups together nodes that are closely connected.
In fraud analysis, this can reveal rings of related customers, shared accounts, or clusters of suspicious activity.

You can use Neo4j GDS algorithms such as connected components, label propagation, and Louvain modularity to find these clusters.

Example:

```cypher
CALL gds.graph.project(
  'fraudGraph',
  ['Customer', 'Order'],
  {
    PLACED: {orientation: 'UNDIRECTED'}
  }
)
YIELD graphName
CALL gds.wcc.stream('fraudGraph')
YIELD componentId, nodeId
RETURN componentId, gds.util.asNode(nodeId).name AS customer
ORDER BY componentId, customer;
```

This finds weakly connected communities of customers through shared orders. For larger or weighted fraud datasets, use label propagation or Louvain modularity instead:

```cypher
CALL gds.labelPropagation.stream('fraudGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS customer, communityId
ORDER BY communityId, customer;
```

```cypher
CALL gds.louvain.stream('fraudGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS customer, communityId
ORDER BY communityId, customer;
```

Community detection is useful for identifying clusters such as social groups, fraud rings, or weakly connected components in a network.

## What to notice

- `shortestPath()` returns a path object, not individual nodes
- variable-length patterns use `*..` ranges
- centrality can be computed with `count()` and `ORDER BY`
- shared-neighbor queries are a lightweight way to see clusters without full community detection

## Common mistakes

- using `shortestPath()` in a query that returns many paths
- forgetting to limit path length when exploring large graphs
- counting raw rows instead of distinct relationships or nodes
- matching redundant patterns that produce duplicate results

## Summary

This lesson introduced graph algorithm thinking by focusing on shortest-path and centrality patterns. You learned when to use hop-based path queries and when to choose weighted path algorithms.

## What's next

Explore the project examples and Neo4j GDS notes to see how these patterns apply to real graphs.
