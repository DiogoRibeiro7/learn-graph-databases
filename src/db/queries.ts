/**
 * Query aggregation module.
 *
 * Domain-specific query logic is defined in `src/db/queryModules/*`.
 * This file re-exports those modules and keeps existing import paths stable.
 */

export { movieQueries } from "./queryModules/movies.js";
export { fraudQueries } from "./queryModules/fraud.js";
export { supplyChainQueries } from "./queryModules/supplyChain.js";
export { centralityQueries } from "./queryModules/centrality.js";

export const recommendationQueries = {
  usersWhoLikedXAlsoLikedY: `
    MATCH (:Item {title: $itemTitle})<-[:INTERACTED {event: "like"}]-(u:User)-[:INTERACTED {event: "like"}]->(rec:Item)
    WHERE rec.title <> $itemTitle
    RETURN rec.title AS recommendedItem, count(DISTINCT u) AS supportingUsers
    ORDER BY supportingUsers DESC, recommendedItem
    LIMIT 10
  `,

  collaborativeForUser: `
    MATCH (target:User {userId: $userId})-[:INTERACTED {event: "like"}]->(liked:Item)
    MATCH (peer:User)-[:INTERACTED {event: "like"}]->(liked)
    WHERE peer <> target
    MATCH (peer)-[:INTERACTED {event: "like"}]->(candidate:Item)
    WHERE NOT (target)-[:INTERACTED]->(candidate)
    RETURN candidate.title AS recommendedItem,
           count(DISTINCT peer) AS peerSupport
    ORDER BY peerSupport DESC, recommendedItem
    LIMIT 10
  `,

  contentBasedForItem: `
    MATCH (seed:Item {itemId: $itemId})-[:IN_CATEGORY]->(cat:Category)
    MATCH (seed)-[:HAS_TAG]->(seedTag:Tag)
    MATCH (candidate:Item)-[:IN_CATEGORY]->(cat)
    MATCH (candidate)-[:HAS_TAG]->(tag:Tag)
    WHERE candidate <> seed AND tag = seedTag
    RETURN candidate.title AS recommendedItem,
           count(DISTINCT tag) AS sharedTags
    ORDER BY sharedTags DESC, recommendedItem
    LIMIT 10
  `,

  hybridForUser: `
    MATCH (target:User {userId: $userId})-[:INTERACTED {event: "like"}]->(liked:Item)
    OPTIONAL MATCH (peer:User)-[:INTERACTED {event: "like"}]->(liked)
    WHERE peer <> target
    OPTIONAL MATCH (peer)-[:INTERACTED {event: "like"}]->(candidate:Item)
    WHERE NOT (target)-[:INTERACTED]->(candidate)
    WITH target, candidate, count(DISTINCT peer) AS collaborativeScore
    WHERE candidate IS NOT NULL
    OPTIONAL MATCH (target)-[:INTERACTED {event: "like"}]->(:Item)-[:HAS_TAG]->(sharedTag:Tag)<-[:HAS_TAG]-(candidate)
    WITH candidate, collaborativeScore, count(DISTINCT sharedTag) AS contentScore
    RETURN candidate.title AS recommendedItem,
           collaborativeScore,
           contentScore,
           (collaborativeScore * 2 + contentScore) AS hybridScore
    ORDER BY hybridScore DESC, recommendedItem
    LIMIT 10
  `,
} as const;

export const rbacQueries = {
  canUserAccessResource: `
    MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
    MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
    MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
    RETURN u.userId AS userId,
           res.resourceId AS resourceId,
           count(DISTINCT perm) > 0 AS canAccess
  `,

  userActionsOnResource: `
    MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
    MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
    MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
    RETURN res.name AS resource,
           collect(DISTINCT perm.action) AS allowedActions
    ORDER BY resource
  `,

  userCapabilities: `
    MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
    MATCH (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)
    MATCH (effective)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource)
    RETURN res.name AS resource,
           collect(DISTINCT perm.action) AS allowedActions
    ORDER BY resource
  `,

  explainUserAccessPath: `
    MATCH (u:User {userId: $userId})-[:ASSIGNED_ROLE]->(assigned:Role)
    MATCH p = (assigned)-[:INHERITS_ROLE*0..]->(effective:Role)-[:GRANTS]->(perm:Permission)-[:APPLIES_TO]->(res:Resource {resourceId: $resourceId})
    RETURN [n IN nodes(p) | coalesce(n.name, n.code, n.userId, n.resourceId)] AS grantPath,
           perm.action AS action
    ORDER BY action
  `,
} as const;

export const knowledgeGraphQueries = {
  directExpertsForConcept: `
    MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(c:Concept {name: $concept})
    RETURN DISTINCT p.name AS expert
    ORDER BY expert
  `,

  inferredExpertsForConcept: `
    MATCH (target:Concept {name: $concept})-[:RELATED_TO*0..1]-(neighbor:Concept)
    MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(neighbor)
    RETURN p.name AS inferredExpert,
           collect(DISTINCT neighbor.name) AS supportingConcepts
    ORDER BY size(supportingConcepts) DESC, inferredExpert
  `,

  organizationRelevanceForConcept: `
    MATCH (target:Concept {name: $concept})-[:RELATED_TO*0..1]-(neighbor:Concept)
    MATCH (o:Organization)-[:FOCUSES_ON]->(neighbor)
    RETURN o.name AS organization,
           collect(DISTINCT neighbor.name) AS conceptCoverage
    ORDER BY size(conceptCoverage) DESC, organization
  `,

  bridgePeopleAcrossConceptNeighborhoods: `
    MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(c:Concept)
    MATCH (c)-[:RELATED_TO*0..1]-(adj:Concept)
    WITH p, collect(DISTINCT adj.name) AS semanticNeighborhood
    WHERE size(semanticNeighborhood) >= 2
    RETURN p.name AS bridgePerson, semanticNeighborhood
    ORDER BY size(semanticNeighborhood) DESC, bridgePerson
  `,
} as const;
