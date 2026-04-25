import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { seedMovies } from "../src/seeds/movies.js";
import { seedFraud } from "../src/seeds/fraud.js";
import { seedSupplyChain } from "../src/seeds/supplyChain.js";
import { seedRecommendation } from "../src/seeds/recommendation.js";
import { runQuery } from "../src/db/session.js";

vi.mock("../src/db/session.js", () => ({
  runQuery: vi.fn(),
}));

describe("seed scripts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("runs seedMovies with the expected query execution", async () => {
    await seedMovies({} as any);

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenCalledWith(expect.anything(), expect.any(String));
  });

  it("runs seedFraud with the expected query execution", async () => {
    await seedFraud({} as any);

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("MERGE"));
  });

  it("runs seedSupplyChain with the expected query execution", async () => {
    await seedSupplyChain({} as any);

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("SUPPLIES"));
  });

  it("runs seedRecommendation with the expected query execution", async () => {
    await seedRecommendation({} as any);

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("INTERACTED"));
  });
});
