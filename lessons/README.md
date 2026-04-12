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

## Recommended order

1. `lesson_01_intro`
2. `lesson_02_modelling`
3. `lesson_03_cypher`
4. `lesson_04_graph_algorithms`

Each lesson builds on the previous one:

- Lesson 01 introduces graph database fundamentals.
- Lesson 02 uses those fundamentals to model a domain as a graph.
- Lesson 03 uses Cypher to query and analyse the models.
- Lesson 04 introduces algorithmic patterns that rely on both the model and Cypher queries.

## Lesson structure

Each lesson follows this pattern:

- `lesson.md` — concept and examples
- `examples.cypher` — runnable Cypher examples
- `exercises.md` — practice exercises and answer keys

## How to use

Open the lesson files in order and run the example Cypher queries against a seeded Neo4j database.

## Visual aids

Visual diagrams for the example domains are available in `assets/diagrams/`.
Use them as a companion while reading the lesson content and exploring the example graphs.
