MERGE (s1:Supplier {supplierId: "S001", name: "North Metals"})
MERGE (s2:Supplier {supplierId: "S002", name: "Blue Circuits"})
MERGE (f1:Factory {factoryId: "F001", name: "Porto Assembly"})
MERGE (c1:Component {componentId: "CMP-01", name: "Steel Frame"})
MERGE (c2:Component {componentId: "CMP-02", name: "Control Board"})

MERGE (s1)-[:SUPPLIES]->(c1)
MERGE (s2)-[:SUPPLIES]->(c2)
MERGE (f1)-[:USES]->(c1)
MERGE (f1)-[:USES]->(c2);
