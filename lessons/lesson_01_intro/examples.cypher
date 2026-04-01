CREATE (:Person {name: "Ana", age: 30});
CREATE (:Person {name: "Bruno", age: 33});
CREATE (:Person {name: "Carla", age: 29});

MATCH (a:Person {name: "Ana"}), (b:Person {name: "Bruno"}), (c:Person {name: "Carla"})
CREATE (a)-[:KNOWS]->(b),
       (b)-[:KNOWS]->(c);

MATCH (p:Person)
RETURN p.name, p.age;

MATCH (a:Person {name: "Ana"})-[:KNOWS]->(b:Person)
RETURN a.name, b.name;
