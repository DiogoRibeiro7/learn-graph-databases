export type CentralityProjectionParams = Readonly<{
  graphName: string;
}>;

export const centralityQueries = {
  projectGraph: `
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
    RETURN graphName, nodeCount, relationshipCount
  `,

  pageRank: `
    CALL gds.pageRank.stream($graphName, {
      maxIterations: 20,
      dampingFactor: 0.85
    })
    YIELD nodeId, score
    RETURN gds.util.asNode(nodeId).name AS person, score
    ORDER BY score DESC
    LIMIT 10
  `,

  betweenness: `
    CALL gds.betweenness.stream($graphName)
    YIELD nodeId, score
    RETURN gds.util.asNode(nodeId).name AS person, score
    ORDER BY score DESC
    LIMIT 10
  `,

  degree: `
    CALL gds.degree.stream($graphName)
    YIELD nodeId, score
    RETURN gds.util.asNode(nodeId).name AS person, score
    ORDER BY score DESC
    LIMIT 10
  `,

  dropGraph: `
    CALL gds.graph.drop($graphName)
    YIELD graphName
    RETURN graphName
  `,
} as const;
