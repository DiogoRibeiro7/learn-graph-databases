/**
 * Reusable Cypher query templates for the movie graph example.
 *
 * These queries are intended for teaching common graph patterns,
 * like traversal, filtering, aggregation, and parameterised lookups.
 */

export const movieQueries = {
  /**
   * List each person and the movie they acted in.
   */
  listActorsAndMovies: `
    MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
    RETURN p.name AS person, m.title AS movie
    ORDER BY person, movie
  `,

  /**
   * Find actor pairs that share a movie.
   */
  coActors: `
    MATCH (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
    WHERE p1 <> p2
    RETURN DISTINCT p1.name AS personA, p2.name AS personB, m.title AS movie
    ORDER BY movie, personA, personB
  `,

  /**
   * Return all drama movies sorted by year.
   */
  dramaMovies: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,

  /**
   * Count movies grouped by genre.
   */
  genreMovieCounts: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
    WITH g.name AS genre, count(m) AS movieCount
    RETURN genre, movieCount
    ORDER BY movieCount DESC
  `,

  /**
   * Return movies in a specific genre.
   */
  moviesByGenre: `
    MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: $genre})
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,

  /**
   * Return movies for a specified actor.
   */
  moviesByActor: `
    MATCH (p:Person {name: $actor})-[:ACTED_IN]->(m:Movie)
    RETURN m.title AS movie, m.year AS year
    ORDER BY year
  `,
} as const;

export const fraudQueries = {
  customersSharingIp: `
    MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_IP]->(ip:IP)
    WITH ip, collect(DISTINCT c.name) AS customers
    WHERE size(customers) > 1
    RETURN ip.value AS ip, customers, size(customers) AS customerCount
    ORDER BY customerCount DESC, ip
  `,

  sharedCreditCards: `
    MATCH (:Order)-[:PAID_WITH]->(cc:CreditCard)<-[:PAID_WITH]-(:Order)
    WITH cc, count(*) AS usageCount
    WHERE usageCount > 1
    RETURN cc.cardHash AS cardHash, usageCount
    ORDER BY usageCount DESC, cardHash
  `,

  suspiciousTransferRings: `
    MATCH p = (a:Account)-[:TRANSFERRED_TO*3..5]->(a)
    RETURN a.accountId AS anchorAccount,
           length(p) AS cycleLength,
           [n IN nodes(p) | n.accountId] AS cycleAccounts
    ORDER BY cycleLength, anchorAccount
    LIMIT 25
  `,

  fanOutAccounts: `
    MATCH (src:Account)-[t:TRANSFERRED_TO]->(dst:Account)
    WHERE datetime(t.occurredAt) >= datetime($windowStart)
      AND datetime(t.occurredAt) < datetime($windowEnd)
    WITH src, collect(DISTINCT dst.accountId) AS recipients, count(t) AS transferCount, sum(t.amount) AS totalOut
    WHERE size(recipients) >= $minRecipients
    RETURN src.accountId AS sourceAccount, recipients, transferCount, totalOut
    ORDER BY transferCount DESC, totalOut DESC
  `,

  highVelocityCards: `
    MATCH (:Customer)-[:PLACED]->(o:Order)-[:PAID_WITH]->(cc:CreditCard)
    WITH cc, count(o) AS orderCount, min(datetime(o.placedAt)) AS firstSeen, max(datetime(o.placedAt)) AS lastSeen
    WITH cc, orderCount, firstSeen, lastSeen, duration.between(firstSeen, lastSeen) AS span
    WHERE orderCount >= $minOrders AND span.days = 0 AND span.seconds <= $maxSeconds
    RETURN cc.cardHash AS cardHash, orderCount, firstSeen, lastSeen, span.seconds AS spanSeconds
    ORDER BY orderCount DESC, spanSeconds ASC
  `,

  customersSharingDevice: `
    MATCH (c:Customer)-[:PLACED]->(:Order)-[:FROM_DEVICE]->(d:Device)
    WITH d, collect(DISTINCT c.name) AS customers
    WHERE size(customers) > 1
    RETURN d.deviceId AS deviceId, customers, size(customers) AS customerCount
    ORDER BY customerCount DESC, deviceId
  `,

  communityDetection: `
    CALL gds.graph.project(
      'fraudGraph',
      ['Customer', 'Order'],
      {
        PLACED: {orientation: 'UNDIRECTED'}
      }
    )
    YIELD graphName
    CALL gds.wcc.stream('fraudGraph')
    YIELD componentId, nodeId
    RETURN componentId, gds.util.asNode(nodeId).name AS customer
    ORDER BY componentId, customer
  `,
} as const;

export const supplyChainQueries = {
  supplierComponentFlow: `
    MATCH (s:Supplier)-[:SUPPLIES]->(c:Component)<-[:USES]-(f:Factory)
    RETURN s.name AS supplier, c.name AS component, f.name AS factory
    ORDER BY supplier, component, factory
  `,

  supplierShortestPath: `
    MATCH (s1:Supplier {name: "North Metals"}), (s2:Supplier {name: "Blue Circuits"})
    MATCH p = shortestPath((s1)-[:SUPPLIES*..4]-(s2))
    RETURN p, length(p) AS hops
  `,

  singleSourceComponents: `
    MATCH (c:Component)<-[:SUPPLIES]-(s:Supplier)
    WITH c, collect(s) AS suppliers
    WHERE size(suppliers) = 1
    RETURN c.name AS component,
           suppliers[0].name AS soleSupplier,
           suppliers[0].riskScore AS supplierRisk
    ORDER BY supplierRisk DESC, component
  `,

  factorySinglePointDependencies: `
    MATCH (f:Factory)-[:USES]->(c:Component)<-[:SUPPLIES]-(s:Supplier)
    WITH f, c, collect(s) AS suppliers
    WHERE size(suppliers) = 1
    WITH f, c, suppliers[0] AS soleSupplier
    RETURN f.name AS factory,
           c.name AS component,
           soleSupplier.name AS soleSupplier,
           soleSupplier.riskScore AS riskScore,
           soleSupplier.region AS region
    ORDER BY riskScore DESC, factory, component
  `,

  multiTierExposure: `
    MATCH (f:Factory)-[:USES]->(c:Component)<-[r:SUPPLIES]-(s:Supplier)
    WHERE r.tier > 1
    RETURN f.name AS factory,
           c.name AS component,
           s.name AS upstreamSupplier,
           r.tier AS supplierTier,
           s.riskScore AS riskScore
    ORDER BY riskScore DESC, supplierTier DESC, factory
  `,
} as const;

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
