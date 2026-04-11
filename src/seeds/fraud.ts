/**
 * Fraud graph seeding utilities.
 *
 * This module creates a sample fraud detection graph that illustrates
 * shared identifiers and suspicious relationship patterns.
 */
import type { Driver } from "neo4j-driver";
import { runQuery } from "../db/session.js";

/**
 * Cypher payload used to seed the fraud graph.
 */
const seedCypher = `
  MERGE (c1:Customer {customerId: "C001", name: "Ana"})
  MERGE (c2:Customer {customerId: "C002", name: "Bruno"})
  MERGE (o1:Order {orderId: "O1001"})
  MERGE (o2:Order {orderId: "O1002"})
  MERGE (card:CreditCard {cardHash: "CARD-XYZ"})
  MERGE (addr:Address {addressId: "ADDR-01"})
  MERGE (ip:IP {value: "10.0.0.8"})
  MERGE (c1)-[:PLACED]->(o1)
  MERGE (c2)-[:PLACED]->(o2)
  MERGE (o1)-[:PAID_WITH]->(card)
  MERGE (o2)-[:PAID_WITH]->(card)
  MERGE (o1)-[:SHIPPED_TO]->(addr)
  MERGE (o2)-[:SHIPPED_TO]->(addr)
  MERGE (o1)-[:FROM_IP]->(ip)
  MERGE (o2)-[:FROM_IP]->(ip)
`;

/**
 * Seeds the fraud example graph.
 *
 * @param driver - Active Neo4j driver.
 * @returns A promise that resolves once the fraud graph is created.
 */
export async function seedFraud(driver: Driver): Promise<void> {
  await runQuery(driver, seedCypher);
}
