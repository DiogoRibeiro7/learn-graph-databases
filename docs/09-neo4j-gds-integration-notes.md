# Neo4j Graph Data Science (GDS) Integration Notes

Neo4j Graph Data Science (GDS) is a library for running graph algorithms and machine learning workflows on property graph data.
This document explains when GDS is useful and how it integrates with Neo4j.

## What is Neo4j GDS?

Neo4j GDS provides algorithms for:

- path finding and shortest paths
- centrality and importance measures
- community detection and clustering
- similarity and embeddings
- graph projection and graph preparation

GDS is designed to operate on graph structures stored in Neo4j and can be used for analytics, recommendations, and graph-based ML.

## Integration approach

GDS works by projecting a subgraph into memory and running algorithms against that projection.
It can use either the native Neo4j store or an in-memory graph representation.

A typical workflow is:

1. Project the graph using `gds.graph.project`.
2. Run an algorithm such as `gds.pageRank.stream`.
3. Inspect or write results back to the database.

Example:

```cypher
CALL gds.graph.project(
  'movieGraph',
  ['Person', 'Movie', 'Genre'],
  {
    ACTED_IN: {orientation: 'UNDIRECTED'},
    IN_GENRE: {orientation: 'UNDIRECTED'}
  }
)
```

Then run an algorithm:

```cypher
CALL gds.pageRank.stream('movieGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10;
```

## When to use GDS

Use Neo4j GDS when you want to:

- analyze graph structure with established algorithms
- detect communities or clusters in the graph
- calculate node importance or centrality
- generate embeddings for similarity and recommendations
- combine graph analytics with property graph queries

GDS is not a replacement for core Cypher queries; it complements them with analytic capabilities.

## Practical notes

- GDS is most valuable for larger, connected graph datasets.
- The library uses memory for graph projections, so size and resource limits matter.
- Results can be streamed, written back to the graph, or exported for downstream processing.
- Neo4j Desktop or AuraDS may require separate GDS installation or license depending on edition.

## Examples of GDS use cases

- **Recommendation systems**: using similarity, embeddings, or link prediction.
- **Fraud detection**: identifying suspicious clusters or high-risk entities.
- **Supply chain analysis**: finding critical suppliers and vulnerable paths.
- **Knowledge graphs**: measuring entity importance and cluster structure.

## GDS vs Cypher

- Use Cypher for transactional graph queries, data updates, and straightforward traversals.
- Use GDS for algorithmic analysis and machine learning workflows over graph structure.
- Both can be combined: run Cypher to prepare data, GDS to analyze it, and Cypher to visualize results.

## Notes for this repo

This repository is primarily focused on graph modeling and Cypher basics, but GDS is a natural next step when exploring advanced analysis.
Add a dedicated `lessons` or `examples` section when you want to demonstrate GDS algorithms such as shortest paths, centrality, or community detection.
