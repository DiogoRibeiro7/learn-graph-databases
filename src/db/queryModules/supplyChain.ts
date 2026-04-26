import type { Record as Neo4jRecord } from "neo4j-driver";

export type SupplierComponentFlowRow = Readonly<{
  supplier: string;
  component: string;
  factory: string;
}>;

export function mapSupplierComponentFlowRows(records: Neo4jRecord[]): SupplierComponentFlowRow[] {
  return records.map((record) => ({
    supplier: String(record.get("supplier")),
    component: String(record.get("component")),
    factory: String(record.get("factory")),
  }));
}

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
