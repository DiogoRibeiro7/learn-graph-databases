MATCH (s:Supplier)-[:SUPPLIES]->(c:Component)<-[:USES]-(f:Factory)
RETURN s.name, c.name, f.name
ORDER BY s.name;

MATCH (f:Factory {name: "Porto Assembly"})-[:USES]->(c:Component)<-[:SUPPLIES]-(s:Supplier)
RETURN f.name, c.name, s.name;

MATCH (s1:Supplier {name: "North Metals"}), (s2:Supplier {name: "Blue Circuits"})
MATCH p = shortestPath((s1)-[:SUPPLIES*..4]-(s2))
RETURN p, length(p) AS hops;

/*
  Example weighted shortest path using Neo4j GDS Dijkstra.
  This assumes `SUPPLIES` relationships carry a numeric `distance` property.
*/
MATCH (s1:Supplier {name: "North Metals"}), (s2:Supplier {name: "Blue Circuits"})
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
  sourceNode: id(s1),
  targetNode: id(s2),
  relationshipWeightProperty: 'distance'
})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId).name AS name, cost;
