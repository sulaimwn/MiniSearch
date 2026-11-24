import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("getSearchStats", () => {
  it("reports zero averages before recording a duration", async () => {
    const { getSearchStats } = await import("./searchesSinceLastRestart");

    expect(getSearchStats()).toEqual({
      averageTextualMs: 0,
      averageGraphicalMs: 0,
    });
  });

  it("averages only timed text searches and still counts every served search", async () => {
    const {
      getSearchStats,
      getTextualSearchesSinceLastRestart,
      incrementTextualSearchesSinceLastRestart,
      recordSearchDuration,
    } = await import("./searchesSinceLastRestart");

    incrementTextualSearchesSinceLastRestart();
    recordSearchDuration("text", 1000);
    incrementTextualSearchesSinceLastRestart();

    expect(getSearchStats()).toEqual({
      averageTextualMs: 1000,
      averageGraphicalMs: 0,
    });
    expect(getTextualSearchesSinceLastRestart()).toBe(2);
  });

  it("averages only timed image searches and still counts every served search", async () => {
    const {
      getGraphicalSearchesSinceLastRestart,
      getSearchStats,
      incrementGraphicalSearchesSinceLastRestart,
      recordSearchDuration,
    } = await import("./searchesSinceLastRestart");

    incrementGraphicalSearchesSinceLastRestart();
    recordSearchDuration("images", 600);
    incrementGraphicalSearchesSinceLastRestart();

    expect(getSearchStats()).toEqual({
      averageTextualMs: 0,
      averageGraphicalMs: 600,
    });
    expect(getGraphicalSearchesSinceLastRestart()).toBe(2);
  });
});
