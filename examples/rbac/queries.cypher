/* Can user X access resource Y? */
MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
RETURN u.userId AS userId,
       res.resourceId AS resourceId,
       count(DISTINCT perm) > 0 AS canAccess;

/* What can user X do on resource Y? */
MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
RETURN res.name AS resource,
       collect(DISTINCT perm.action) AS allowedActions
ORDER BY resource;

/* What can user X do overall? */
MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource)
RETURN res.name AS resource,
       collect(DISTINCT perm.action) AS allowedActions
ORDER BY resource;

/* Explainability: which role path grants permission? */
MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
MATCH p = (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
RETURN [n IN nodes(p) | coalesce(n.name, n.code, n.userId, n.resourceId)] AS grantPath,
       perm.action AS action
ORDER BY action;
