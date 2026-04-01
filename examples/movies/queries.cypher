MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN p.name, m.title
ORDER BY p.name, m.title;

MATCH (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
WHERE p1 <> p2
RETURN DISTINCT p1.name, p2.name, m.title
ORDER BY m.title;

MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Drama"})
RETURN m.title, m.year
ORDER BY m.year;
