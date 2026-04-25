MATCH (o:Order)
WHERE o.totalAmount > 100
RETURN o.orderId AS orderId, o.totalAmount AS totalAmount
ORDER BY totalAmount DESC;

MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country IN ["USA", "Canada"] AND o.status <> "CANCELLED"
RETURN c.name AS customer, o.orderId AS orderId, o.status AS status
ORDER BY customer, orderId;

MATCH (p:Person)
WHERE p.name STARTS WITH "A"
RETURN p.name AS person
ORDER BY person;

MATCH (m:Movie)
WHERE m.title CONTAINS "The"
RETURN m.title AS movie
ORDER BY movie;

MATCH (u:User)
WHERE u.email =~ "(?i).+@example\\.com"
RETURN u.username AS username, u.email AS email
ORDER BY username;

MATCH (c:Customer)
WHERE EXISTS {
  MATCH (c)-[:PLACED]->(o:Order)
  WHERE o.totalAmount >= 250
}
RETURN c.name AS customer
ORDER BY customer;

MATCH (c:Customer)
WHERE NOT EXISTS {
  MATCH (c)-[:PLACED]->(:Order)
}
RETURN c.name AS customerWithoutOrders
ORDER BY customerWithoutOrders;

MATCH (o:Order)
WHERE o.status IS NOT NULL
  AND (o.status = "PENDING_REVIEW" OR o.status = "FLAGGED")
  AND NOT o.totalAmount < 50
RETURN o.orderId AS orderId, o.status AS status, o.totalAmount AS totalAmount
ORDER BY totalAmount DESC;
