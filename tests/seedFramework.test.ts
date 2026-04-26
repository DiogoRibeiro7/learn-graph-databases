import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  clearGraph,
  isSeedDomain,
  listSeedDefinitions,
  runSeedDomain,
  seedDomains,
  seedRegistry,
} from "../src/seeds/framework.js";
import { runQuery } from "../src/db/session.js";

vi.mock("../src/db/session.js", () => ({
  runQuery: vi.fn(),
}));

describe("seed framework", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("lists all supported seed domains", () => {
    const listed = listSeedDefinitions().map((d) => d.domain);
    expect(listed).toEqual([...seedDomains]);
  });

  it("validates known and unknown domains", () => {
    expect(isSeedDomain("movies")).toBe(true);
    expect(isSeedDomain("fraud")).toBe(true);
    expect(isSeedDomain("unknown")).toBe(false);
  });

  it("runs clear query for clearGraph", async () => {
    await clearGraph({} as any);
    expect(runQuery).toHaveBeenCalledWith(expect.anything(), "MATCH (n) DETACH DELETE n");
  });

  it("runs selected domain seed without clear", async () => {
    const seedSpy = vi.spyOn(seedRegistry.movies, "seed").mockResolvedValueOnce();
    await runSeedDomain({} as any, "movies", { clearBeforeSeed: false });

    expect(seedSpy).toHaveBeenCalledTimes(1);
    expect(runQuery).not.toHaveBeenCalled();

    seedSpy.mockRestore();
  });

  it("runs clear before selected domain seed", async () => {
    const seedSpy = vi.spyOn(seedRegistry.fraud, "seed").mockResolvedValueOnce();
    await runSeedDomain({} as any, "fraud", { clearBeforeSeed: true });

    expect(runQuery).toHaveBeenCalledWith(expect.anything(), "MATCH (n) DETACH DELETE n");
    expect(seedSpy).toHaveBeenCalledTimes(1);

    seedSpy.mockRestore();
  });
});
