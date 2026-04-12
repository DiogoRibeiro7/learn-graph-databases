MATCH (a:Customer {name: "Alice"}), (b:Customer {name: "Bruno"})
MATCH p = shortestPath((a)-[:PLACED*..3]-(b))
RETURN p, length(p) AS hops;

/*
  Weighted shortest path example using Neo4j GDS Dijkstra.
  This assumes relationships like SUPPLIES include a numeric `distance` property.
*/
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

MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer, count(o) AS orderCount
ORDER BY orderCount DESC;

MATCH (c1:Customer)-[:PLACED]->(:Order)<-[:PLACED]-(c2:Customer)
WHERE c1 <> c2
RETURN c1.name AS customerA, c2.name AS customerB, count(*) AS sharedOrders
ORDER BY sharedOrders DESC;

/*
  Community detection example using Neo4j GDS connected components.
  This is useful for identifying clusters of related customers in fraud graphs.
*/
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