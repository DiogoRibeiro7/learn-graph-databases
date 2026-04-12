MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
WITH ip, collect(DISTINCT c.name) AS customers
WHERE size(customers) > 1
RETURN ip.value, customers;

MATCH (:Order)-[:PAID_WITH]->(cc:CreditCard)<-[:PAID_WITH]-(:Order)
RETURN DISTINCT cc.cardHash;

/*
  Community detection example using Neo4j GDS to find customer clusters.
  This assumes the fraud graph is projected with customer and order nodes.
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
