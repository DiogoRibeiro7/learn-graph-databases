MERGE (s1:Supplier {supplierId: "S001"})
SET s1.name = "North Metals", s1.country = "PT", s1.region = "EU", s1.riskScore = 2, s1.criticality = "medium"
MERGE (s2:Supplier {supplierId: "S002"})
SET s2.name = "Blue Circuits", s2.country = "DE", s2.region = "EU", s2.riskScore = 3, s2.criticality = "high"
MERGE (s3:Supplier {supplierId: "S003"})
SET s3.name = "Helix Polymers", s3.country = "TR", s3.region = "EMEA", s3.riskScore = 6, s3.criticality = "high"
MERGE (s4:Supplier {supplierId: "S004"})
SET s4.name = "Pacific Semis", s4.country = "TW", s4.region = "APAC", s4.riskScore = 7, s4.criticality = "high"
MERGE (s5:Supplier {supplierId: "S005"})
SET s5.name = "Atlas Packaging", s5.country = "ES", s5.region = "EU", s5.riskScore = 2, s5.criticality = "low"
MERGE (s6:Supplier {supplierId: "S006"})
SET s6.name = "Andes Minerals", s6.country = "CL", s6.region = "LATAM", s6.riskScore = 5, s6.criticality = "medium"

MERGE (f1:Factory {factoryId: "F001"})
SET f1.name = "Porto Assembly", f1.country = "PT", f1.region = "EU"
MERGE (f2:Factory {factoryId: "F002"})
SET f2.name = "Brno Assembly", f2.country = "CZ", f2.region = "EU"

MERGE (c1:Component {componentId: "CMP-01"})
SET c1.name = "Steel Frame"
MERGE (c2:Component {componentId: "CMP-02"})
SET c2.name = "Control Board"
MERGE (c3:Component {componentId: "CMP-03"})
SET c3.name = "Battery Module"
MERGE (c4:Component {componentId: "CMP-04"})
SET c4.name = "Sensor Pack"

MERGE (s1)-[:SUPPLIES {tier: 1, leadTimeDays: 8, distanceKm: 320, costIndex: 1.0}]->(c1)
MERGE (s2)-[:SUPPLIES {tier: 1, leadTimeDays: 12, distanceKm: 1900, costIndex: 1.1}]->(c2)
MERGE (s3)-[:SUPPLIES {tier: 2, leadTimeDays: 21, distanceKm: 3100, costIndex: 1.3}]->(c2)
MERGE (s4)-[:SUPPLIES {tier: 1, leadTimeDays: 26, distanceKm: 9800, costIndex: 1.6}]->(c3)
MERGE (s6)-[:SUPPLIES {tier: 2, leadTimeDays: 19, distanceKm: 10400, costIndex: 1.4}]->(c3)
MERGE (s5)-[:SUPPLIES {tier: 1, leadTimeDays: 5, distanceKm: 1400, costIndex: 0.9}]->(c4)

MERGE (f1)-[:USES]->(c1)
MERGE (f1)-[:USES]->(c2)
MERGE (f1)-[:USES]->(c3)
MERGE (f1)-[:USES]->(c4)

MERGE (f2)-[:USES]->(c1)
MERGE (f2)-[:USES]->(c2)
MERGE (f2)-[:USES]->(c4);
