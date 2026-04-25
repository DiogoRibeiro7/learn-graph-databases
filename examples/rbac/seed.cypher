MERGE (u1:User {userId: "U001"}) SET u1.name = "Ana"
MERGE (u2:User {userId: "U002"}) SET u2.name = "Bruno"
MERGE (u3:User {userId: "U003"}) SET u3.name = "Carla"
MERGE (u4:User {userId: "U004"}) SET u4.name = "Diego";

MERGE (rAdmin:Role {name: "Admin"})
MERGE (rManager:Role {name: "Manager"})
MERGE (rAnalyst:Role {name: "Analyst"})
MERGE (rViewer:Role {name: "Viewer"})
MERGE (rSupport:Role {name: "Support"});

MERGE (rAdmin)-[:INHERITS_ROLE]->(rManager)
MERGE (rManager)-[:INHERITS_ROLE]->(rAnalyst)
MERGE (rAnalyst)-[:INHERITS_ROLE]->(rViewer)
MERGE (rSupport)-[:INHERITS_ROLE]->(rViewer);

MERGE (u1)-[:ASSIGNED_ROLE]->(rAdmin)
MERGE (u2)-[:ASSIGNED_ROLE]->(rManager)
MERGE (u3)-[:ASSIGNED_ROLE]->(rAnalyst)
MERGE (u4)-[:ASSIGNED_ROLE]->(rSupport);

MERGE (resReports:Resource {resourceId: "RES-REPORTS"}) SET resReports.name = "Financial Reports"
MERGE (resWarehouse:Resource {resourceId: "RES-WAREHOUSE"}) SET resWarehouse.name = "Warehouse API"
MERGE (resUsers:Resource {resourceId: "RES-USERS"}) SET resUsers.name = "User Administration";

MERGE (pViewReports:Permission {code: "REPORTS_READ"}) SET pViewReports.action = "read"
MERGE (pEditReports:Permission {code: "REPORTS_WRITE"}) SET pEditReports.action = "write"
MERGE (pOpsWarehouse:Permission {code: "WAREHOUSE_OPERATE"}) SET pOpsWarehouse.action = "operate"
MERGE (pManageUsers:Permission {code: "USERS_MANAGE"}) SET pManageUsers.action = "manage";

MERGE (pViewReports)-[:APPLIES_TO]->(resReports)
MERGE (pEditReports)-[:APPLIES_TO]->(resReports)
MERGE (pOpsWarehouse)-[:APPLIES_TO]->(resWarehouse)
MERGE (pManageUsers)-[:APPLIES_TO]->(resUsers);

MERGE (rViewer)-[:GRANTS]->(pViewReports)
MERGE (rAnalyst)-[:GRANTS]->(pEditReports)
MERGE (rManager)-[:GRANTS]->(pOpsWarehouse)
MERGE (rAdmin)-[:GRANTS]->(pManageUsers);
