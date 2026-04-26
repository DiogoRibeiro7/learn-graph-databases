# Knowledge graph schema

## Node labels

- `Person`
- `Organization`
- `Concept`
- `Document`

## Relationship types

- `WORKS_AT` (`Person -> Organization`)
- `AUTHORED` (`Person -> Document`)
- `MENTIONS` (`Document -> Concept`)
- `FOCUSES_ON` (`Organization -> Concept`)
- `RELATED_TO` (`Concept -> Concept`)

## Facts represented

Examples of fact triples in graph form:

- Person `WORKS_AT` Organization
- Person `AUTHORED` Document
- Document `MENTIONS` Concept
- Organization `FOCUSES_ON` Concept
- Concept `RELATED_TO` Concept

## Inference-style patterns

These are not hard-coded rules, but discoverable through traversal:

- A person can be inferred as concept-adjacent via authored documents and concept mentions.
- A person can be inferred as domain-relevant if their organization focuses on concepts related to their authored topics.
- Related concepts expand semantic neighborhoods beyond exact keyword matches.

## Example questions

- Which people are likely relevant to a concept even if they never directly mention it?
- Which organizations are connected to a concept through related concepts?
- Which experts overlap across adjacent concept areas?
