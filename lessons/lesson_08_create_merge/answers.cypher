# Exercise answers for Lesson 08

# 1)
CREATE (c:Customer {customerId: "C010", name: "Diana", country: "USA"})
CREATE (o:Order {orderId: "O9001", totalAmount: 220, status: "PLACED"})
CREATE (c)-[:PLACED]->(o);

# 2)
MERGE (c:Customer {customerId: "C010"})
ON CREATE SET c.name = "Diana", c.country = "USA", c.createdAt = datetime();

# 3)
MERGE (c:Customer {customerId: "C010"})
ON CREATE SET c.name = "Diana", c.country = "USA", c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime();

# 4)
MERGE (o:Order {orderId: "O9001"})
ON CREATE SET o.totalAmount = 220, o.status = "PLACED";

# 5)
MERGE (c:Customer {customerId: "C010"})
MERGE (o:Order {orderId: "O9001"})
MERGE (c)-[:PLACED]->(o);

# 6) bad pattern: volatile fields inside MERGE identity map.
MERGE (c:Customer {customerId: "C010", updatedAt: datetime()});

# 6) corrected pattern.
MERGE (c:Customer {customerId: "C010"})
SET c.updatedAt = datetime();

# 7)
UNWIND [
  {customerId: "C010", name: "Diana", country: "USA"},
  {customerId: "C011", name: "Evan", country: "Portugal"},
  {customerId: "C012", name: "Fatima", country: "Spain"}
] AS row
MERGE (c:Customer {customerId: row.customerId})
ON CREATE SET c.name = row.name, c.country = row.country, c.createdAt = datetime()
ON MATCH SET c.lastSeenAt = datetime();

# 8) Conceptual:
# CREATE is better for append-only event rows where each write should be a new fact.

# 9) Conceptual:
# Avoid MATCH (a), (b) CREATE ... unless intentional; it creates Cartesian pairings.

# 10)
MATCH (c:Customer)
RETURN c.customerId AS customerId, count(*) AS copies
ORDER BY copies DESC, customerId;
