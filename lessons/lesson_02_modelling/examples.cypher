MERGE (c1:Customer {customerId: "C001", name: "Ana"})
MERGE (o1:Order {orderId: "O1001"})
MERGE (cc1:CreditCard {cardHash: "CARD-ABC"})
MERGE (a1:Address {addressId: "ADDR-01"})
MERGE (ip1:IP {value: "192.168.1.10"})
MERGE (c1)-[:PLACED]->(o1)
MERGE (o1)-[:PAID_WITH]->(cc1)
MERGE (o1)-[:SHIPPED_TO]->(a1)
MERGE (o1)-[:FROM_IP]->(ip1);

MATCH (c:Customer)-[:PLACED]->(o:Order)-[:SHIPPED_TO]->(a:Address)
RETURN c.name, o.orderId, a.addressId;
