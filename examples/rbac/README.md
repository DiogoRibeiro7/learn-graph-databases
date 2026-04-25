# RBAC Example

This example demonstrates role-based access control (RBAC) using a graph model with users, roles, permissions, resources, and role inheritance.

## Contents

- `schema.md` - RBAC graph schema and relationship semantics
- `seed.cypher` - seed data for users, role hierarchy, and permissions
- `queries.cypher` - sample Cypher queries for access checks and capability lookup

## Usage

1. Seed the graph:

```bash
yarn seed:rbac
```

2. Run the query runner:

```bash
yarn query:rbac
```

## Notes

The RBAC example is useful for teaching:

- hierarchical role modelling
- transitive permission inheritance with variable-length traversals
- direct answers to authorization questions with graph patterns
- reduction of complex multi-table joins common in relational RBAC
