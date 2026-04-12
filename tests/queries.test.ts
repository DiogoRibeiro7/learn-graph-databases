import { describe, expect, it } from "vitest";
import { fraudQueries, movieQueries, supplyChainQueries } from "../src/db/queries.js";

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
  });

  it("defines the expected fraud query set", () => {
    expect(Object.keys(fraudQueries)).toEqual([
      "customersSharingIp",
      "sharedCreditCards",
    ]);
  });
});

describe("supplyChainQueries", () => {
  it("includes supply-chain query patterns", () => {
    expect(supplyChainQueries.supplierComponentFlow).toContain("SUPPLIES");
    expect(supplyChainQueries.supplierComponentFlow).toContain("USES");
    expect(supplyChainQueries.supplierShortestPath).toContain("shortestPath");
    expect(supplyChainQueries.supplierShortestPath).toContain("length(p) AS hops");
  });

  it("defines the expected supply-chain query set", () => {
    expect(Object.keys(supplyChainQueries)).toEqual([
      "supplierComponentFlow",
      "supplierShortestPath",
    ]);
  });
});
