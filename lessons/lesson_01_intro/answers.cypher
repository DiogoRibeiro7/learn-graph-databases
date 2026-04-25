# Exercise answers for Lesson 01
# 1) Create a new Person node named David.
# Why it works: CREATE always inserts a new node with the given label and properties.
CREATE (:Person {name: "David"});

# 2) Add a KNOWS relationship from Carla to David.
# Why it works: MATCH finds the two existing people; MERGE ensures one relationship instance.
MATCH (carla:Person {name: "Carla"}), (david:Person {name: "David"})
MERGE (carla)-[:KNOWS]->(david);

# 3) Return all people known by Bruno.
# Why it works: The pattern starts at Bruno and traverses outgoing KNOWS edges.
MATCH (:Person {name: "Bruno"})-[:KNOWS]->(known:Person)
RETURN known.name AS knownByBruno
ORDER BY knownByBruno;

# 4) Add a WORKS_AT relationship between a person and a company.
# Why it works: MERGE on each entity keeps this idempotent for repeated runs.
MERGE (p:Person {name: "David"})
MERGE (company:Company {name: "GraphCorp"})
MERGE (p)-[:WORKS_AT]->(company);

# 5) Model explanation (conceptual):
# - Nodes: Person, Company
# - Relationships: KNOWS, WORKS_AT
# - Properties: name (and any other scalar attributes)
