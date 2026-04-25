MERGE (c1:Customer {customerId: "C001"})
SET c1.name = "Ana"
MERGE (c2:Customer {customerId: "C002"})
SET c2.name = "Bruno"
MERGE (c3:Customer {customerId: "C003"})
SET c3.name = "Carla"
MERGE (c4:Customer {customerId: "C004"})
SET c4.name = "Diego"
MERGE (c5:Customer {customerId: "C005"})
SET c5.name = "Eva"

MERGE (a1:Account {accountId: "A101"})
MERGE (a2:Account {accountId: "A102"})
MERGE (a3:Account {accountId: "A103"})
MERGE (a4:Account {accountId: "A104"})
MERGE (a5:Account {accountId: "A105"})
MERGE (a6:Account {accountId: "A106"})

MERGE (c1)-[:OWNS_ACCOUNT]->(a1)
MERGE (c2)-[:OWNS_ACCOUNT]->(a2)
MERGE (c3)-[:OWNS_ACCOUNT]->(a3)
MERGE (c4)-[:OWNS_ACCOUNT]->(a4)
MERGE (c5)-[:OWNS_ACCOUNT]->(a5)

MERGE (cardA:CreditCard {cardHash: "CARD-AAA"})
MERGE (cardB:CreditCard {cardHash: "CARD-BBB"})
MERGE (cardC:CreditCard {cardHash: "CARD-CCC"})

MERGE (addr1:Address {addressId: "ADDR-01"})
MERGE (addr2:Address {addressId: "ADDR-02"})

MERGE (ip1:IP {value: "10.0.0.8"})
MERGE (ip2:IP {value: "10.0.0.9"})
MERGE (ip3:IP {value: "10.0.0.10"})

MERGE (d1:Device {deviceId: "DEV-01"})
MERGE (d2:Device {deviceId: "DEV-02"})
MERGE (d3:Device {deviceId: "DEV-03"})

MERGE (o1:Order {orderId: "O1001"})
SET o1.totalAmount = 95, o1.placedAt = "2026-04-01T10:00:00Z", o1.status = "PLACED"
MERGE (o2:Order {orderId: "O1002"})
SET o2.totalAmount = 105, o2.placedAt = "2026-04-01T10:08:00Z", o2.status = "PLACED"
MERGE (o3:Order {orderId: "O1003"})
SET o3.totalAmount = 115, o3.placedAt = "2026-04-01T10:14:00Z", o3.status = "PLACED"
MERGE (o4:Order {orderId: "O1004"})
SET o4.totalAmount = 420, o4.placedAt = "2026-04-01T11:02:00Z", o4.status = "REVIEW"
MERGE (o5:Order {orderId: "O1005"})
SET o5.totalAmount = 430, o5.placedAt = "2026-04-01T11:07:00Z", o5.status = "REVIEW"
MERGE (o6:Order {orderId: "O1006"})
SET o6.totalAmount = 87, o6.placedAt = "2026-04-01T12:00:00Z", o6.status = "PLACED"

MERGE (c1)-[:PLACED]->(o1)
MERGE (c2)-[:PLACED]->(o2)
MERGE (c3)-[:PLACED]->(o3)
MERGE (c4)-[:PLACED]->(o4)
MERGE (c5)-[:PLACED]->(o5)
MERGE (c2)-[:PLACED]->(o6)

MERGE (o1)-[:PAID_WITH]->(cardA)
MERGE (o2)-[:PAID_WITH]->(cardA)
MERGE (o3)-[:PAID_WITH]->(cardA)
MERGE (o4)-[:PAID_WITH]->(cardB)
MERGE (o5)-[:PAID_WITH]->(cardB)
MERGE (o6)-[:PAID_WITH]->(cardC)

MERGE (o1)-[:SHIPPED_TO]->(addr1)
MERGE (o2)-[:SHIPPED_TO]->(addr1)
MERGE (o3)-[:SHIPPED_TO]->(addr1)
MERGE (o4)-[:SHIPPED_TO]->(addr2)
MERGE (o5)-[:SHIPPED_TO]->(addr2)
MERGE (o6)-[:SHIPPED_TO]->(addr1)

MERGE (o1)-[:FROM_IP]->(ip1)
MERGE (o2)-[:FROM_IP]->(ip1)
MERGE (o3)-[:FROM_IP]->(ip1)
MERGE (o4)-[:FROM_IP]->(ip2)
MERGE (o5)-[:FROM_IP]->(ip2)
MERGE (o6)-[:FROM_IP]->(ip3)

MERGE (o1)-[:FROM_DEVICE]->(d1)
MERGE (o2)-[:FROM_DEVICE]->(d1)
MERGE (o3)-[:FROM_DEVICE]->(d2)
MERGE (o4)-[:FROM_DEVICE]->(d3)
MERGE (o5)-[:FROM_DEVICE]->(d3)
MERGE (o6)-[:FROM_DEVICE]->(d1)

MERGE (a1)-[:TRANSFERRED_TO {txId: "T001", amount: 900, occurredAt: "2026-04-01T09:00:00Z"}]->(a2)
MERGE (a2)-[:TRANSFERRED_TO {txId: "T002", amount: 890, occurredAt: "2026-04-01T09:10:00Z"}]->(a3)
MERGE (a3)-[:TRANSFERRED_TO {txId: "T003", amount: 880, occurredAt: "2026-04-01T09:20:00Z"}]->(a1)

MERGE (a4)-[:TRANSFERRED_TO {txId: "T004", amount: 300, occurredAt: "2026-04-01T10:00:00Z"}]->(a1)
MERGE (a4)-[:TRANSFERRED_TO {txId: "T005", amount: 310, occurredAt: "2026-04-01T10:05:00Z"}]->(a2)
MERGE (a4)-[:TRANSFERRED_TO {txId: "T006", amount: 320, occurredAt: "2026-04-01T10:09:00Z"}]->(a3)
MERGE (a4)-[:TRANSFERRED_TO {txId: "T007", amount: 330, occurredAt: "2026-04-01T10:12:00Z"}]->(a5)

MERGE (a5)-[:TRANSFERRED_TO {txId: "T008", amount: 150, occurredAt: "2026-04-01T10:30:00Z"}]->(a6);

MERGE (t1:Transaction {txId: "T001"})
SET t1.amount = 900, t1.occurredAt = "2026-04-01T09:00:00Z"
MERGE (t2:Transaction {txId: "T002"})
SET t2.amount = 890, t2.occurredAt = "2026-04-01T09:10:00Z"
MERGE (t3:Transaction {txId: "T003"})
SET t3.amount = 880, t3.occurredAt = "2026-04-01T09:20:00Z"
MERGE (t4:Transaction {txId: "T004"})
SET t4.amount = 300, t4.occurredAt = "2026-04-01T10:00:00Z"
MERGE (t5:Transaction {txId: "T005"})
SET t5.amount = 310, t5.occurredAt = "2026-04-01T10:05:00Z"
MERGE (t6:Transaction {txId: "T006"})
SET t6.amount = 320, t6.occurredAt = "2026-04-01T10:09:00Z"
MERGE (t7:Transaction {txId: "T007"})
SET t7.amount = 330, t7.occurredAt = "2026-04-01T10:12:00Z"
MERGE (t8:Transaction {txId: "T008"})
SET t8.amount = 150, t8.occurredAt = "2026-04-01T10:30:00Z"

MERGE (a1)-[:INITIATED]->(t1)
MERGE (t1)-[:RECEIVED_BY]->(a2)
MERGE (a2)-[:INITIATED]->(t2)
MERGE (t2)-[:RECEIVED_BY]->(a3)
MERGE (a3)-[:INITIATED]->(t3)
MERGE (t3)-[:RECEIVED_BY]->(a1)
MERGE (a4)-[:INITIATED]->(t4)
MERGE (t4)-[:RECEIVED_BY]->(a1)
MERGE (a4)-[:INITIATED]->(t5)
MERGE (t5)-[:RECEIVED_BY]->(a2)
MERGE (a4)-[:INITIATED]->(t6)
MERGE (t6)-[:RECEIVED_BY]->(a3)
MERGE (a4)-[:INITIATED]->(t7)
MERGE (t7)-[:RECEIVED_BY]->(a5)
MERGE (a5)-[:INITIATED]->(t8)
MERGE (t8)-[:RECEIVED_BY]->(a6);
