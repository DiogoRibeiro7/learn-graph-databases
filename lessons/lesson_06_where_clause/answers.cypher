# Exercise answers for Lesson 06

# 1)
MATCH (o:Order)
WHERE o.totalAmount > 150
RETURN o.orderId, o.totalAmount
ORDER BY o.totalAmount DESC;

# 2)
MATCH (c:Customer)-[:PLACED]->(o:Order)
WHERE c.country IN ["Portugal", "Spain"] AND o.status <> "CANCELLED"
RETURN c.name, o.orderId, o.status
ORDER BY c.name, o.orderId;

# 3)
MATCH (p:Person)
WHERE p.name STARTS WITH "Jo"
RETURN p.name
ORDER BY p.name;

# 4)
MATCH (m:Movie)
WHERE m.title CONTAINS "Graph"
RETURN m.title
ORDER BY m.title;

# 5)
MATCH (u:User)
WHERE u.email =~ "(?i).+@example\\.com"
RETURN u.username, u.email
ORDER BY u.username;

# 6)
MATCH (c:Customer)
WHERE EXISTS {
  MATCH (c)-[:PLACED]->(o:Order)
  WHERE o.totalAmount > 300
}
RETURN c.name
ORDER BY c.name;

# 7)
MATCH (c:Customer)
WHERE NOT EXISTS {
  MATCH (c)-[:PLACED]->(:Order)
}
RETURN c.name
ORDER BY c.name;

# 8)
MATCH (o:Order)
WHERE (o.status = "FLAGGED" OR o.status = "PENDING_REVIEW")
  AND NOT o.totalAmount < 50
RETURN o.orderId, o.status, o.totalAmount;

# 9)
MATCH (o:Order)
WHERE o.status IS NOT NULL AND o.status = "FLAGGED"
RETURN o.orderId, o.status, o.totalAmount
ORDER BY o.totalAmount DESC;

# 10) Conceptual:
# EXISTS { ... } is preferable when a condition depends on the presence of a related sub-pattern.
