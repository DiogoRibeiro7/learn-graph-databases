/* Direct experts on a concept via authored documents */
MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(c:Concept {name: $concept})
RETURN DISTINCT p.name AS expert
ORDER BY expert;

/* Inference-style: experts through related concepts (1 hop semantic expansion) */
MATCH (target:Concept {name: $concept})-[:RELATED_TO*0..1]-(neighbor:Concept)
MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(neighbor)
RETURN p.name AS inferredExpert,
       collect(DISTINCT neighbor.name) AS supportingConcepts
ORDER BY size(supportingConcepts) DESC, inferredExpert;

/* Organization relevance by concept neighborhood */
MATCH (target:Concept {name: $concept})-[:RELATED_TO*0..1]-(neighbor:Concept)
MATCH (o:Organization)-[:FOCUSES_ON]->(neighbor)
RETURN o.name AS organization,
       collect(DISTINCT neighbor.name) AS conceptCoverage
ORDER BY size(conceptCoverage) DESC, organization;

/* Cross-domain bridge people: authored docs mentioning concepts in at least two concept neighborhoods */
MATCH (p:Person)-[:AUTHORED]->(:Document)-[:MENTIONS]->(c:Concept)
MATCH (c)-[:RELATED_TO*0..1]-(adj:Concept)
WITH p, collect(DISTINCT adj.name) AS semanticNeighborhood
WHERE size(semanticNeighborhood) >= 2
RETURN p.name AS bridgePerson, semanticNeighborhood
ORDER BY size(semanticNeighborhood) DESC, bridgePerson;
