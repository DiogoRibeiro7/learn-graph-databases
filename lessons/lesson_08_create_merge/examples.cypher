CREATE (c:Customer {customerId: "C001", name: "Alice", country: "USA"})
CREATE (o:Order {orderId: "O1001", totalAmount: 150, status: "PLACED"})
CREATE (c)-[:PLACED]->(o);

MERGE (c:Customer {customerId: "C001"})
ON CREATE SET c.name = "Alice", c.country = "USA", c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime();

MERGE (o:Order {orderId: "O1001"})
ON CREATE SET o.totalAmount = 150, o.status = "PLACED";

MERGE (c:Customer {customerId: "C001"})
MERGE (o:Order {orderId: "O1001"})
MERGE (c)-[:PLACED]->(o);

UNWIND [
  {customerId: "C001", name: "Alice", country: "USA"},
  {customerId: "C002", name: "Bob", country: "Portugal"},
  {customerId: "C003", name: "Carla", country: "Spain"}
] AS row
MERGE (c:Customer {customerId: row.customerId})
ON CREATE SET c.name = row.name, c.country = row.country, c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime();

MERGE (ip:IP {value: "203.0.113.10"})
ON CREATE SET ip.firstSeen = datetime(), ip.riskScore = 10
ON MATCH SET ip.lastSeen = datetime(), ip.hitCount = coalesce(ip.hitCount, 0) + 1;

MATCH (c:Customer {customerId: "C001"})
MATCH (o:Order {orderId: "O1001"})
MERGE (o)-[:FROM_IP]->(:IP {value: "203.0.113.10"})
MERGE (c)-[:PLACED]->(o);

MATCH (c:Customer {customerId: "C001"})-[:PLACED]->(o:Order)
RETURN c.name AS customer, collect(o.orderId) AS orders;
