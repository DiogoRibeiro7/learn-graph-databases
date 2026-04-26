export type OntologyInferenceParams = Readonly<{
  patientId: string;
}>;

export const ontologyQueries = {
  entitiesMissingType: `
    MATCH (e:Entity)
    WHERE NOT (e)-[:INSTANCE_OF]->(:OntologyClass)
    RETURN e.id AS entityId, labels(e) AS labels
  `,

  subclassExpansion: `
    MATCH (sub:OntologyClass)-[:SUBCLASS_OF*1..]->(sup:OntologyClass)
    RETURN sub.name AS subclass, sup.name AS superclass
    ORDER BY subclass, superclass
  `,

  inferredTherapiesForPatient: `
    MATCH (p:Patient {id: $patientId})-[:DIAGNOSED_WITH]->(d:Disease)
    MATCH (g:Gene)-[:ASSOCIATED_WITH]->(d)
    MATCH (drug:Drug)-[:TARGETS]->(g)
    RETURN DISTINCT p.name AS patient,
           d.name AS disease,
           drug.name AS inferredDrug,
           collect(DISTINCT g.name) AS supportingGenes
    ORDER BY inferredDrug
  `,

  explainInferredTherapyPaths: `
    MATCH pth = (:Patient {id: $patientId})-[:DIAGNOSED_WITH]->(:Disease)<-[:ASSOCIATED_WITH]-(:Gene)<-[:TARGETS]-(:Drug)
    RETURN [n IN nodes(pth) | coalesce(n.name, n.id)] AS inferencePath
    ORDER BY size(inferencePath)
  `,
} as const;
