/* Users who liked X also liked Y */
MATCH (:Item {title: $itemTitle})<-[:INTERACTED {event: "like"}]-(u:User)-[:INTERACTED {event: "like"}]->(rec:Item)
WHERE rec.title <> $itemTitle
RETURN rec.title AS recommendedItem, count(DISTINCT u) AS supportingUsers
ORDER BY supportingUsers DESC, recommendedItem
LIMIT 10;

/* Collaborative filtering for a target user */
MATCH (target:User {userId: $userId})-[:INTERACTED {event: "like"}]->(liked:Item)
MATCH (peer:User)-[:INTERACTED {event: "like"}]->(liked)
WHERE peer <> target
MATCH (peer)-[:INTERACTED {event: "like"}]->(candidate:Item)
WHERE NOT (target)-[:INTERACTED]->(candidate)
RETURN candidate.title AS recommendedItem,
       count(DISTINCT peer) AS peerSupport
ORDER BY peerSupport DESC, recommendedItem
LIMIT 10;

/* Content-based recommendation for an item */
MATCH (seed:Item {itemId: $itemId})-[:IN_CATEGORY]->(cat:Category)
MATCH (seed)-[:HAS_TAG]->(seedTag:Tag)
MATCH (candidate:Item)-[:IN_CATEGORY]->(cat)
MATCH (candidate)-[:HAS_TAG]->(tag:Tag)
WHERE candidate <> seed AND tag = seedTag
RETURN candidate.title AS recommendedItem,
       count(DISTINCT tag) AS sharedTags
ORDER BY sharedTags DESC, recommendedItem
LIMIT 10;

/* Hybrid recommendation score for a user */
MATCH (target:User {userId: $userId})-[:INTERACTED {event: "like"}]->(liked:Item)
OPTIONAL MATCH (peer:User)-[:INTERACTED {event: "like"}]->(liked)
WHERE peer <> target
OPTIONAL MATCH (peer)-[:INTERACTED {event: "like"}]->(candidate:Item)
WHERE NOT (target)-[:INTERACTED]->(candidate)
WITH target, candidate, count(DISTINCT peer) AS collaborativeScore
WHERE candidate IS NOT NULL
OPTIONAL MATCH (target)-[:INTERACTED {event: "like"}]->(seedItem:Item)-[:HAS_TAG]->(sharedTag:Tag)<-[:HAS_TAG]-(candidate)
WITH candidate, collaborativeScore, count(DISTINCT sharedTag) AS contentScore
RETURN candidate.title AS recommendedItem,
       collaborativeScore,
       contentScore,
       (collaborativeScore * 2 + contentScore) AS hybridScore
ORDER BY hybridScore DESC, recommendedItem
LIMIT 10;
