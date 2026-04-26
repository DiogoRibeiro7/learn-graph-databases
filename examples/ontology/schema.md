# Ontology-driven graph schema

## Ontology layer

### Node labels

- `OntologyClass`
- `OntologyProperty`

### Relationship types

- `SUBCLASS_OF` (`OntologyClass -> OntologyClass`)
- `DOMAIN` (`OntologyProperty -> OntologyClass`)
- `RANGE` (`OntologyProperty -> OntologyClass`)

## Instance layer

### Node labels

- `Entity`
- `Gene`
- `Disease`
- `Drug`
- `Pathway`
- `Patient`

### Relationship types

- `INSTANCE_OF` (`Entity -> OntologyClass`)
- `ASSOCIATED_WITH` (`Gene -> Disease`)
- `TARGETS` (`Drug -> Gene`)
- `TREATS` (`Drug -> Disease`)
- `PARTICIPATES_IN` (`Gene -> Pathway`)
- `DIAGNOSED_WITH` (`Patient -> Disease`)
- `PRESCRIBED` (`Patient -> Drug`)

## Ontology constraints demonstrated

- Every instance should connect to an `OntologyClass` via `INSTANCE_OF`.
- Domain/range declarations on ontology properties document expected source/target classes.
- `SUBCLASS_OF` supports inherited classification and transitive reasoning.

## Inference and reasoning patterns

- Infer that a patient may benefit from a drug if diagnosed disease is genetically associated with genes targeted by the drug.
- Expand concept neighborhoods using class hierarchy (`SUBCLASS_OF*`).
- Explain inferred recommendations by returning supporting paths.
