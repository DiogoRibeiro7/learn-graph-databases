import type { Record as Neo4jRecord } from "neo4j-driver";

export type FanOutAccountsParams = Readonly<{
  windowStart: string;
  windowEnd: string;
  minRecipients: number;
}>;

export type HighVelocityCardsParams = Readonly<{
  minOrders: number;
  maxSeconds: number;
}>;

export type SharedIpRow = Readonly<{
  ip: string;
  customers: unknown;
  customerCount: unknown;
}>;

export type SharedCardRow = Readonly<{
  cardHash: string;
  usageCount: unknown;
}>;

export function mapSharedIpRows(records: Neo4jRecord[]): SharedIpRow[] {
  return records.map((record) => ({
    ip: String(record.get("ip")),
    customers: record.get("customers"),
    customerCount: record.get("customerCount"),
  }));
}

export function mapSharedCardRows(records: Neo4jRecord[]): SharedCardRow[] {
  return records.map((record) => ({
    cardHash: String(record.get("cardHash")),
    usageCount: record.get("usageCount"),
  }));
}

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
