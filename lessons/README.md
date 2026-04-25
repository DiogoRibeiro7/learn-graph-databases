# Lessons

This folder contains the lesson content for the course.

## Lesson list

- `lesson_01_intro`
  - Introduction to graph databases
- `lesson_02_modelling`
  - Graph modelling
- `lesson_03_cypher`
  - Cypher basics
- `lesson_04_graph_algorithms`
  - Graph algorithms basics
- `lesson_05_match_clause`
  - Deep dive on MATCH and OPTIONAL MATCH

## Recommended order

1. `lesson_01_intro`
2. `lesson_02_modelling`
3. `lesson_03_cypher`
4. `lesson_04_graph_algorithms`
5. `lesson_05_match_clause`

Each lesson builds on the previous one:

- Lesson 01 introduces graph database fundamentals.
- Lesson 02 uses those fundamentals to model a domain as a graph.
- Lesson 03 uses Cypher to query and analyse the models.
- Lesson 04 introduces algorithmic patterns that rely on both the model and Cypher queries.
- Lesson 05 deepens pattern matching skills with `MATCH`, paths, multiple clauses, and `OPTIONAL MATCH`.

## Lesson structure

Each lesson follows this pattern:

- `lesson.md` — concept and examples
- `examples.cypher` — runnable Cypher examples
- `exercises.md` — practice exercises and answer keys

## How to use

Open the lesson files in order and run the example Cypher queries against a seeded Neo4j database.

Each lesson is paired with the repository examples and seed scripts:

- `lesson_01_intro` introduces graph basics.
- `lesson_02_modelling` uses the fraud domain and graph modelling patterns.
- `lesson_03_cypher` explores Cypher with the same fraud and movie example data.
- `lesson_04_graph_algorithms` introduces path and centrality patterns using example graphs and GDS notes.
- `lesson_05_match_clause` focuses on read-query pattern design and optional traversals.

For the example domains, use the corresponding seed scripts and query runners, such as:

```bash
yarn seed:movies
yarn query:movies
```

and similarly:

```bash
yarn seed:fraud
yarn query:fraud
```

## Visual aids

Visual diagrams for the example domains are available in `assets/diagrams/`.
Use them as a companion while reading the lesson content and exploring the example graphs.
