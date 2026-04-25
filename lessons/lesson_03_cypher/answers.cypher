# Exercise answers for Lesson 03
# The lesson already includes sample answers in exercises.md; this file mirrors them for runnable use.

# 1)
MATCH (c:Customer {name: "Alice"})-[:PLACED]->(o:Order)
RETURN o.orderId, o.totalAmount;

# 2)
MATCH (o:Order)-[:PAID_WITH]->(cc:CreditCard)
WITH cc, count(o) AS orderCount
WHERE orderCount > 1
RETURN cc.cardHash, orderCount;

# 3)
MATCH (ip:IP)<-[:FROM_IP]-(o:Order)<-[:PLACED]-(c:Customer)
WITH ip, collect(DISTINCT c) AS customers
WHERE size(customers) > 1
RETURN ip.value, size(customers) AS customerCount;

# 4)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE o.totalAmount > 100
RETURN c.name, o.orderId, o.totalAmount;

# 5) Conceptual: prefer MERGE for idempotency and duplicate prevention.

# 6)
CREATE (:CreditCard {cardHash: "abc123", issuer: "Visa"});
MERGE (c:Customer {name: "Alice"})
MERGE (o:Order {orderId: "O1002"})
MERGE (c)-[:PLACED]->(o);

# 7)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, count(o) AS orderCount
WHERE orderCount > 1
RETURN c.name AS customer, orderCount
ORDER BY orderCount DESC;

# 8)
UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (:Genre {name: genreName});

# 9)
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie;

# 10)
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: "Sci-Fi"})
RETURN m.title AS movie
UNION ALL
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: "Drama"})
RETURN m.title AS movie
ORDER BY movie;

# 11)
UNWIND ["Sci-Fi", "Drama", "Action"] AS genreName
MERGE (g:Genre {name: genreName})
FOREACH (_ IN CASE WHEN genreName = "Sci-Fi" THEN [1] ELSE [] END |
  SET g.featured = true
);

# 12)
MATCH (c:Customer)-[:PLACED]->(o:Order)
RETURN c.name AS customer,
       count(o) AS orderCount,
       sum(o.totalAmount) AS totalSpent
ORDER BY totalSpent DESC;

# 13)
MERGE (c:Customer {name: "Alice"})
ON CREATE SET c.created = timestamp()
ON MATCH SET c.lastSeen = timestamp();

# 14)
MATCH (c:Customer)-[:PLACED*1..2]->(o:Order)
RETURN c.name, o.orderId;
