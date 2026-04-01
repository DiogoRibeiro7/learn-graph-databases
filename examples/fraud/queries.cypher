MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
WITH ip, collect(DISTINCT c.name) AS customers
WHERE size(customers) > 1
RETURN ip.value, customers;

MATCH (:Order)-[:PAID_WITH]->(cc:CreditCard)<-[:PAID_WITH]-(:Order)
RETURN DISTINCT cc.cardHash;
