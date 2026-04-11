# Supply chain graph schema

## Node labels

- `Supplier`
- `Factory`
- `Component`
- `Shipment`

## Relationship types

- `SUPPLIES`
- `USES`
- `SHIPS`

Relationships such as `SUPPLIES` can also carry numeric properties like `distance` or `cost` for weighted pathfinding examples.

## Example questions

- Which suppliers affect a given factory?
- Which factories depend on a specific component?
- What is the downstream impact of a supplier failure?
