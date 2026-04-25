MATCH (s:Supplier)-[:SUPPLIES]->(c:Component)<-[:USES]-(f:Factory)
RETURN s.name, c.name, f.name
ORDER BY s.name;

MATCH (f:Factory {name: "Porto Assembly"})-[:USES]->(c:Component)<-[:SUPPLIES]-(s:Supplier)
RETURN f.name, c.name, s.name;

MATCH (s1:Supplier {name: "North Metals"}), (s2:Supplier {name: "Blue Circuits"})
MATCH p = shortestPath((s1)-[:SUPPLIES*..4]-(s2))
RETURN p, length(p) AS hops;

/* Components with single-source dependency (single point of failure) */
MATCH (c:Component)<-[:SUPPLIES]-(s:Supplier)
WITH c, collect(s) AS suppliers
WHERE size(suppliers) = 1
RETURN c.name AS component,
       suppliers[0].name AS soleSupplier,
       suppliers[0].riskScore AS supplierRisk
ORDER BY supplierRisk DESC, component;

/* Factory-level critical dependencies (high-risk, sole supplier components) */
MATCH (f:Factory)-[:USES]->(c:Component)<-[:SUPPLIES]-(s:Supplier)
WITH f, c, collect(s) AS suppliers
WHERE size(suppliers) = 1
WITH f, c, suppliers[0] AS soleSupplier
RETURN f.name AS factory,
       c.name AS component,
       soleSupplier.name AS soleSupplier,
       soleSupplier.riskScore AS riskScore,
       soleSupplier.region AS region
ORDER BY riskScore DESC, factory, component;

/* Multi-tier exposure: suppliers with tier > 1 feeding used components */
MATCH (f:Factory)-[:USES]->(c:Component)<-[r:SUPPLIES]-(s:Supplier)
WHERE r.tier > 1
RETURN f.name AS factory,
       c.name AS component,
       s.name AS upstreamSupplier,
       r.tier AS supplierTier,
       s.riskScore AS riskScore
ORDER BY riskScore DESC, supplierTier DESC, factory;

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
