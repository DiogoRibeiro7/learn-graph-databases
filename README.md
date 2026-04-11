# learn-graph-databases

[![CI](https://github.com/DiogoRibeiro7/learn-graph-databases/actions/workflows/ci.yml/badge.svg)](https://github.com/DiogoRibeiro7/learn-graph-databases/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/DiogoRibeiro7/learn-graph-databases)](https://github.com/DiogoRibeiro7/learn-graph-databases/blob/develop/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5.x-blue)](https://neo4j.com/)

A teaching repository for graph databases, Neo4j, Cypher, graph modelling, and practical graph-based applications.

## Table of Contents

- [What this repository teaches](#what-this-repository-teaches)
- [Who this is for](#who-this-is-for)
- [Stack](#stack)
- [Repository structure](#repository-structure)
- [Learning path](#learning-path)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Teaching design](#teaching-design)
- [Initial examples](#initial-examples)
- [Notes for instructors](#notes-for-instructors)
- [Contributing](#contributing)

## What this repository teaches

This repository is designed as a practical course-style codebase. It focuses on:

- graph database fundamentals
- graph modelling
- Cypher querying
- local Neo4j usage with Docker Compose
- TypeScript integration with Neo4j
- small applied graph examples

The goal is not only to explain graph databases, but to teach how to **think in graphs** and how to implement real examples.

## Who this is for

This repository is suitable for:

- developers learning graph databases for the first time
- data professionals who want to understand graph modelling
- engineers who want to learn Neo4j and Cypher
- teachers who want reusable teaching material

## Stack

- Neo4j
- Cypher
- TypeScript
- Node.js
- Yarn
- Docker Compose

## Repository structure

```text
learn-graph-databases/
├── README.md
├── ROADMAP.md
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── docs/
├── lessons/
├── examples/
├── src/
├── tests/
└── assets/
```

## Learning path

A suggested order is:

1. Read the documents in `docs/`
2. Work through the lessons in `lessons/`
   - start with `lesson_01_intro`
   - then `lesson_02_modelling`
   - continue with `lesson_03_cypher`
   - finish with `lesson_04_graph_algorithms`

See `lessons/README.md` for a lesson index and quick navigation.

Lesson overview:

| Lesson | Topic | File |
| --- | --- | --- |
| Lesson 01 | Introduction to graph databases | `lessons/lesson_01_intro/lesson.md` |
| Lesson 02 | Graph modelling | `lessons/lesson_02_modelling/lesson.md` |
| Lesson 03 | Cypher basics | `lessons/lesson_03_cypher/lesson.md` |
| Lesson 04 | Graph algorithms basics | `lessons/lesson_04_graph_algorithms/lesson.md` |

## Course navigation

Use the learning path and repo structure to move through the material in a practical way:

- Start with `docs/` for the conceptual foundation.
- Follow the lesson sequence in `lessons/`:
  - `lessons/lesson_01_intro`
  - `lessons/lesson_02_modelling`
  - `lessons/lesson_03_cypher`
  - `lessons/lesson_04_graph_algorithms`
- Explore example datasets in `examples/`:
  - `examples/movies`
  - `examples/fraud`
  - `examples/supply-chain`
- Run the corresponding TypeScript seed and query scripts in `src/scripts/`.
- Use `lessons/README.md` for a lesson index and quick navigation.

3. Start Neo4j locally
4. Seed the example datasets
5. Run the Cypher queries
6. Read the TypeScript integration code
7. Extend the examples with your own models

## Quick start

### 1. Copy the environment file

```bash
cp .env.example .env
```

### 2. Start Neo4j

```bash
docker compose up -d
```

Neo4j Browser will be available at:

- `http://localhost:7474`

Bolt will be available at:

- `bolt://localhost:7687`

### 3. Install dependencies

```bash
yarn install
```

### 4. Ping the database

```bash
yarn ping
```

### 5. Seed the movie example

```bash
yarn seed:movies
```

### 6. Run example queries

```bash
yarn query:movies
```

## Default local credentials

The Docker setup uses the values from `.env.example`:

- username: `neo4j`
- password: `password123`

Change them before using this beyond local development.

## Scripts

```bash
yarn dev
yarn build
yarn typecheck
yarn ping
yarn seed:movies
yarn seed:fraud
yarn seed:supply
yarn query:movies
yarn test
```

## Contributing

If you want to help improve the repository, please read [CONTRIBUTING.md](./CONTRIBUTING.md) and use the provided issue and pull request templates.

## Teaching design

Each lesson follows the same structure:

1. concept
2. why it matters
3. small example
4. Cypher queries
5. exercises
6. common mistakes

This keeps the repository consistent and easy to teach from.

## Initial examples

### Movie graph
Good for beginners. It teaches:

- people
- movies
- genres
- acting relationships
- recommendation-style traversal

### Fraud graph
Good for showing why graph databases matter. It teaches:

- shared identifiers
- connection patterns
- suspicious clusters
- multi-hop reasoning

### Supply chain graph
Good for dependency and path thinking. It teaches:

- suppliers
- components
- factories
- disruption analysis
- upstream and downstream traversal

## Notes for instructors

A good teaching sequence is:

- start with the movie graph
- compare graph vs relational thinking
- introduce pattern matching with Cypher
- explore graph algorithms and path analysis
- move to fraud detection to show practical value
- finish with a domain-specific modelling exercise

## Roadmap

See `ROADMAP.md`.

## License

MIT
