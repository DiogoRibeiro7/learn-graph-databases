import { describe, expect, it } from "vitest";
import { findQueryByName, parseArgs } from "../src/scripts/runMovieQueries.js";

describe("runMovieQueries CLI", () => {
  it("parses the query option", () => {
    const options = parseArgs(["--query", "co-actors"]);

    expect(options.queryName).toBe("co-actors");
    expect(options.list).toBe(false);
    expect(options.help).toBe(false);
    expect(options.parameters).toEqual({});
  });

  it("parses the short query option", () => {
    const options = parseArgs(["-q", "drama-movies"]);

    expect(options.queryName).toBe("drama-movies");
  });

  it("parses the list option", () => {
    expect(parseArgs(["--list"]).list).toBe(true);
    expect(parseArgs(["-l"]).list).toBe(true);
  });

  it("parses the help option", () => {
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
  });

  it("parses query parameters", () => {
    const options = parseArgs(["--query", "movies-by-genre", "--param", "genre=Drama"]);

    expect(options.queryName).toBe("movies-by-genre");
    expect(options.parameters).toEqual({ genre: "Drama" });
  });

  it("parses multiple parameters", () => {
    const options = parseArgs(["--param", "actor=Keanu Reeves", "--param", "genre=Action"]);

    expect(options.parameters).toEqual({ actor: "Keanu Reeves", genre: "Action" });
  });

  it("finds a known query entry", () => {
    const entry = findQueryByName("drama-movies");

    expect(entry).toBeDefined();
    expect(entry?.label).toBe("Drama movies");
  });

  it("finds the new genre movie counts query", () => {
    const entry = findQueryByName("genre-movie-counts");

    expect(entry).toBeDefined();
    expect(entry?.label).toBe("Movie counts by genre");
  });

  it("returns undefined for an unknown query name", () => {
    expect(findQueryByName("unknown-query")).toBeUndefined();
  });
});
