# RBAC graph schema

## Node labels

- `User`
- `Role`
- `Permission`
- `Resource`

## Relationship types

- `ASSIGNED_ROLE` (`User -> Role`)
- `INHERITS_ROLE` (`Role -> Role`)
- `GRANTS` (`Role -> Permission`)
- `APPLIES_TO` (`Permission -> Resource`)

## Role hierarchy

Roles can inherit other roles:

- `Admin -> Manager -> Analyst -> Viewer`

This allows permission reuse and avoids duplicating grants across sibling roles.

## Example questions

- Can user X access resource Y?
- Which actions can user X perform on resource Y?
- Which resources can user X access through inherited roles?
- Which roles grant permission Z and where does that permission apply?

## Graph advantage over join-heavy RBAC

Authorization checks become direct graph traversals:

- User to role assignment
- Role inheritance expansion
- Role to permission grant
- Permission to resource scope

Instead of recursive SQL joins and bridge-table chains, Cypher naturally expresses transitive authorization paths with concise patterns.
