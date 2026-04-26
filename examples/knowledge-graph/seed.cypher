MERGE (p1:Person {personId: "P001"}) SET p1.name = "Alice"
MERGE (p2:Person {personId: "P002"}) SET p2.name = "Bruno"
MERGE (p3:Person {personId: "P003"}) SET p3.name = "Carla"
MERGE (p4:Person {personId: "P004"}) SET p4.name = "Diego";

MERGE (o1:Organization {orgId: "O001"}) SET o1.name = "Graph Labs"
MERGE (o2:Organization {orgId: "O002"}) SET o2.name = "Data Insights"
MERGE (o3:Organization {orgId: "O003"}) SET o3.name = "AI Systems";

MERGE (c1:Concept {name: "Knowledge Graphs"})
MERGE (c2:Concept {name: "Entity Resolution"})
MERGE (c3:Concept {name: "Graph Algorithms"})
MERGE (c4:Concept {name: "Semantic Search"})
MERGE (c5:Concept {name: "Machine Learning"});

MERGE (d1:Document {docId: "D001"}) SET d1.title = "Entity-centric Modelling"
MERGE (d2:Document {docId: "D002"}) SET d2.title = "Graph Algorithms in Practice"
MERGE (d3:Document {docId: "D003"}) SET d3.title = "Semantic Search Patterns"
MERGE (d4:Document {docId: "D004"}) SET d4.title = "ML with Graph Features";

MERGE (p1)-[:WORKS_AT]->(o1)
MERGE (p2)-[:WORKS_AT]->(o1)
MERGE (p3)-[:WORKS_AT]->(o2)
MERGE (p4)-[:WORKS_AT]->(o3);

MERGE (o1)-[:FOCUSES_ON]->(c1)
MERGE (o1)-[:FOCUSES_ON]->(c2)
MERGE (o2)-[:FOCUSES_ON]->(c4)
MERGE (o2)-[:FOCUSES_ON]->(c3)
MERGE (o3)-[:FOCUSES_ON]->(c5)
MERGE (o3)-[:FOCUSES_ON]->(c3);

MERGE (p1)-[:AUTHORED]->(d1)
MERGE (p2)-[:AUTHORED]->(d2)
MERGE (p3)-[:AUTHORED]->(d3)
MERGE (p4)-[:AUTHORED]->(d4);

MERGE (d1)-[:MENTIONS]->(c1)
MERGE (d1)-[:MENTIONS]->(c2)
MERGE (d2)-[:MENTIONS]->(c3)
MERGE (d2)-[:MENTIONS]->(c1)
MERGE (d3)-[:MENTIONS]->(c4)
MERGE (d3)-[:MENTIONS]->(c1)
MERGE (d4)-[:MENTIONS]->(c5)
MERGE (d4)-[:MENTIONS]->(c3);

MERGE (c1)-[:RELATED_TO]->(c4)
MERGE (c4)-[:RELATED_TO]->(c1)
MERGE (c1)-[:RELATED_TO]->(c2)
MERGE (c2)-[:RELATED_TO]->(c1)
MERGE (c3)-[:RELATED_TO]->(c5)
MERGE (c5)-[:RELATED_TO]->(c3)
MERGE (c3)-[:RELATED_TO]->(c1)
MERGE (c1)-[:RELATED_TO]->(c3);
