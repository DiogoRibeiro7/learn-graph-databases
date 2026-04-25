# Exercise answers for Lesson 02

# 1) Add a second order for the same customer.
# Why it works: CREATE adds a new order while reusing a matched customer.
MATCH (c:Customer {name: "Alice"})
CREATE (o:Order {orderId: "O2002", totalAmount: 125, status: "PLACED"})
CREATE (c)-[:PLACED]->(o);

# 2) Reuse the same address for another order.
# Why it works: MATCH selects an existing Address node and links a new order to it.
MATCH (c:Customer {name: "Alice"})
MATCH (a:Address {addressId: "ADDR-1"})
CREATE (o:Order {orderId: "O2003", totalAmount: 89, status: "PLACED"})
CREATE (c)-[:PLACED]->(o)
CREATE (o)-[:SHIPPED_TO]->(a);

# 3) Reuse the same IP for a different customer.
# Why it works: Existing IP node is shared across multiple orders/customers.
MATCH (ip:IP {value: "203.0.113.10"})
MATCH (c:Customer {name: "Bruno"})
CREATE (o:Order {orderId: "O2004", totalAmount: 240, status: "PLACED"})
CREATE (c)-[:PLACED]->(o)
CREATE (o)-[:FROM_IP]->(ip);

# 4) Conceptual answer:
# Shared entities reduce duplication and reveal cross-customer links (e.g., shared IP/card/address),
# which are key fraud indicators.

# 5) Conceptual answer:
# Use email as a property when only storing one value per customer and no shared relationships are needed.
# Use an Email node when deduplication, sharing, or relationship analysis across customers is required.
