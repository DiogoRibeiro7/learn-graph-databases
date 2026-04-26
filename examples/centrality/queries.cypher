/* Project graph for centrality algorithms */
CALL gds.graph.project(
  $graphName,
  "Person",
  {
    INTERACTS_WITH: {
      orientation: "UNDIRECTED",
      properties: "weight"
    }
  }
)
YIELD graphName, nodeCount, relationshipCount
RETURN graphName, nodeCount, relationshipCount;

/* PageRank - influencer detection */
CALL gds.pageRank.stream($graphName, {
  maxIterations: 20,
  dampingFactor: 0.85
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS person, score
ORDER BY score DESC
LIMIT 10;

/* Betweenness centrality - critical connectors */
CALL gds.betweenness.stream($graphName)
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS person, score
ORDER BY score DESC
LIMIT 10;

/* Degree centrality - local hubs */
CALL gds.degree.stream($graphName)
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS person, score
ORDER BY score DESC
LIMIT 10;

/* Cleanup in-memory projection */
CALL gds.graph.drop($graphName)
YIELD graphName
RETURN graphName;
