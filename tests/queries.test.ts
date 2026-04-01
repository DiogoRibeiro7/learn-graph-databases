import { describe, expect, it } from "vitest";
import { movieQueries } from "../src/db/queries.js";

describe("movieQueries", () => {
  it("exposes starter query strings", () => {
    expect(movieQueries.listActorsAndMovies).toContain("MATCH");
    expect(movieQueries.coActors).toContain("ACTED_IN");
    expect(movieQueries.dramaMovies).toContain("Drama");
  });
});
