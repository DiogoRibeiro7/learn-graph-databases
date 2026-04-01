MATCH (s:Supplier)-[:SUPPLIES]->(c:Component)<-[:USES]-(f:Factory)
RETURN s.name, c.name, f.name
ORDER BY s.name;

MATCH (f:Factory {name: "Porto Assembly"})-[:USES]->(c:Component)<-[:SUPPLIES]-(s:Supplier)
RETURN f.name, c.name, s.name;
