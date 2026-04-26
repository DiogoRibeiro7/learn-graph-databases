import { describe, expect, it } from "vitest";
import {
  centralityQueries,
  fraudQueries,
  knowledgeGraphQueries,
  movieQueries,
  ontologyQueries,
  rbacQueries,
  recommendationQueries,
  supplyChainQueries,
} from "../src/db/queries.js";

describe("movieQueries", () => {
  it("exposes starter query strings", () => {
    expect(movieQueries.listActorsAndMovies).toContain("MATCH");
    expect(movieQueries.coActors).toContain("ACTED_IN");
    expect(movieQueries.dramaMovies).toContain("Drama");
    expect(movieQueries.genreMovieCounts).toContain("WITH g.name AS genre");
    expect(movieQueries.moviesByGenre).toContain("$genre");
    expect(movieQueries.moviesByActor).toContain("$actor");
  });

  it("defines the expected movie query set", () => {
    expect(Object.keys(movieQueries)).toEqual([
      "listActorsAndMovies",
      "coActors",
      "dramaMovies",
      "genreMovieCounts",
      "moviesByGenre",
      "moviesByActor",
    ]);
  });
});

describe("fraudQueries", () => {
  it("includes fraud query patterns", () => {
    expect(fraudQueries.customersSharingIp).toContain("FROM_IP");
    expect(fraudQueries.customersSharingIp).toContain("collect(DISTINCT c.name)");
    expect(fraudQueries.sharedCreditCards).toContain("PAID_WITH");
    expect(fraudQueries.suspiciousTransferRings).toContain("TRANSFERRED_TO*3..5");
    expect(fraudQueries.fanOutAccounts).toContain("$windowStart");
    expect(fraudQueries.highVelocityCards).toContain("duration.between");
    expect(fraudQueries.customersSharingDevice).toContain("FROM_DEVICE");
  });

  it("defines the expected fraud query set", () => {
    expect(Object.keys(fraudQueries)).toEqual([
      "customersSharingIp",
      "sharedCreditCards",
      "suspiciousTransferRings",
      "fanOutAccounts",
      "highVelocityCards",
      "customersSharingDevice",
      "communityDetection",
    ]);
  });
});

describe("supplyChainQueries", () => {
  it("includes supply-chain query patterns", () => {
    expect(supplyChainQueries.supplierComponentFlow).toContain("SUPPLIES");
    expect(supplyChainQueries.supplierComponentFlow).toContain("USES");
    expect(supplyChainQueries.supplierShortestPath).toContain("shortestPath");
    expect(supplyChainQueries.supplierShortestPath).toContain("length(p) AS hops");
    expect(supplyChainQueries.singleSourceComponents).toContain("size(suppliers) = 1");
    expect(supplyChainQueries.factorySinglePointDependencies).toContain("soleSupplier");
    expect(supplyChainQueries.multiTierExposure).toContain("r.tier > 1");
  });

  it("defines the expected supply-chain query set", () => {
    expect(Object.keys(supplyChainQueries)).toEqual([
      "supplierComponentFlow",
      "supplierShortestPath",
      "singleSourceComponents",
      "factorySinglePointDependencies",
      "multiTierExposure",
    ]);
  });
});

describe("recommendationQueries", () => {
  it("includes recommendation query patterns", () => {
    expect(recommendationQueries.usersWhoLikedXAlsoLikedY).toContain("itemTitle");
    expect(recommendationQueries.collaborativeForUser).toContain("peerSupport");
    expect(recommendationQueries.contentBasedForItem).toContain("sharedTags");
    expect(recommendationQueries.hybridForUser).toContain("hybridScore");
  });

  it("defines the expected recommendation query set", () => {
    expect(Object.keys(recommendationQueries)).toEqual([
      "usersWhoLikedXAlsoLikedY",
      "collaborativeForUser",
      "contentBasedForItem",
      "hybridForUser",
    ]);
  });
});

describe("rbacQueries", () => {
  it("includes RBAC query patterns", () => {
    expect(rbacQueries.canUserAccessResource).toContain("ASSIGNED_ROLE");
    expect(rbacQueries.canUserAccessResource).toContain("INHERITS_ROLE*0..");
    expect(rbacQueries.userActionsOnResource).toContain("allowedActions");
    expect(rbacQueries.userCapabilities).toContain("APPLIES_TO");
    expect(rbacQueries.explainUserAccessPath).toContain("grantPath");
  });

  it("defines the expected RBAC query set", () => {
    expect(Object.keys(rbacQueries)).toEqual([
      "canUserAccessResource",
      "userActionsOnResource",
      "userCapabilities",
      "explainUserAccessPath",
    ]);
  });
});

describe("knowledgeGraphQueries", () => {
  it("includes knowledge-graph query patterns", () => {
    expect(knowledgeGraphQueries.directExpertsForConcept).toContain("AUTHORED");
    expect(knowledgeGraphQueries.inferredExpertsForConcept).toContain("RELATED_TO*0..1");
    expect(knowledgeGraphQueries.organizationRelevanceForConcept).toContain("FOCUSES_ON");
    expect(knowledgeGraphQueries.bridgePeopleAcrossConceptNeighborhoods).toContain("semanticNeighborhood");
  });

  it("defines the expected knowledge-graph query set", () => {
    expect(Object.keys(knowledgeGraphQueries)).toEqual([
      "directExpertsForConcept",
      "inferredExpertsForConcept",
      "organizationRelevanceForConcept",
      "bridgePeopleAcrossConceptNeighborhoods",
    ]);
  });
});

describe("centralityQueries", () => {
  it("includes centrality query patterns", () => {
    expect(centralityQueries.projectGraph).toContain("gds.graph.project");
    expect(centralityQueries.pageRank).toContain("gds.pageRank.stream");
    expect(centralityQueries.betweenness).toContain("gds.betweenness.stream");
    expect(centralityQueries.degree).toContain("gds.degree.stream");
    expect(centralityQueries.dropGraph).toContain("gds.graph.drop");
  });

  it("defines the expected centrality query set", () => {
    expect(Object.keys(centralityQueries)).toEqual([
      "projectGraph",
      "pageRank",
      "betweenness",
      "degree",
      "dropGraph",
    ]);
  });
});

describe("ontologyQueries", () => {
  it("includes ontology query patterns", () => {
    expect(ontologyQueries.entitiesMissingType).toContain("INSTANCE_OF");
    expect(ontologyQueries.subclassExpansion).toContain("SUBCLASS_OF*1..");
    expect(ontologyQueries.inferredTherapiesForPatient).toContain("TARGETS");
    expect(ontologyQueries.explainInferredTherapyPaths).toContain("inferencePath");
  });

  it("defines the expected ontology query set", () => {
    expect(Object.keys(ontologyQueries)).toEqual([
      "entitiesMissingType",
      "subclassExpansion",
      "inferredTherapiesForPatient",
      "explainInferredTherapyPaths",
    ]);
  });
});
