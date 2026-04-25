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

`SUPPLIES` relationships carry operational metadata such as:

- `leadTimeDays`
- `distanceKm`
- `costIndex`
- `tier`

Suppliers include risk/geography metadata:

- `country`
- `region`
- `riskScore`
- `criticality`

## Example questions

- Which suppliers affect a given factory?
- Which factories depend on a specific component?
- What is the downstream impact of a supplier failure?
- Which suppliers are single points of failure for a component or factory?
- Which high-risk tier-2 suppliers indirectly impact final assembly?
