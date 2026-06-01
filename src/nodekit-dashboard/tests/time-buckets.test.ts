import { describe, expect, it } from "vitest";

import { buildRunRows } from "../src/derive";
import { formatDateTimeWithZone } from "../src/format";
import { healthClass, healthLabel } from "../src/health";
import { pageInfo, pageRows, rowsInTimeRange, RUNS_PAGE_SIZE } from "../src/pagination";
import { matchesRunSearch, searchableRunText } from "../src/search";
import { bucketRuns, integerTicks, relativeTickLabel, visibleRange } from "../src/time-buckets";
import type { CachedRunItem, RunTableRow } from "../src/types";

const nowMs = Date.parse("2026-05-31T12:30:00Z");

const runs: CachedRunItem[] = [
  {
    run_id: "run-1",
    site_id: "site-1",
    status: "submitted",
    is_archived: false,
    timestamp_created: "2026-05-31T10:15:00Z",
    platform_label: "prolific",
  },
  {
    run_id: "run-2",
    site_id: "site-1",
    status: "invalid",
    is_archived: false,
    timestamp_created: "2026-05-31T11:15:00Z",
  },
  {
    run_id: "run-3",
    site_id: "site-2",
    status: "completed",
    is_archived: false,
    timestamp_created: "2026-05-30T10:15:00Z",
  },
];

describe("run bucketing", () => {
  it("creates a 12 hour range ending at present", () => {
    const range = visibleRange("12h", nowMs);

    expect(range.labelUnit).toBe("hour");
    expect(range.bucketMs).toBe(5 * 60 * 1000);
    expect(range.endMs).toBe(nowMs);
    expect(range.startMs).toBe(nowMs - 12 * 60 * 60 * 1000);
  });

  it("uses the requested fixed bucket sizes for each lookback", () => {
    expect(visibleRange("24h", nowMs).bucketMs).toBe(5 * 60 * 1000);
    expect(visibleRange("7d", nowMs).bucketMs).toBe(60 * 60 * 1000);
    expect(visibleRange("30d", nowMs).bucketMs).toBe(24 * 60 * 60 * 1000);
    expect(visibleRange("7d", nowMs).labelUnit).toBe("day");
    expect(visibleRange("30d", nowMs).labelUnit).toBe("day");
  });

  it("never creates buckets that end in the future", () => {
    const rows = buildRunRows(runs, []);
    const range = visibleRange("12h", nowMs);
    const buckets = bucketRuns(rows, range);

    expect(buckets.at(-1)?.endMs).toBe(nowMs);
    expect(Math.max(...buckets.map((bucket) => bucket.endMs))).toBe(nowMs);
  });

  it("counts total runs without status splitting", () => {
    const rows = buildRunRows(runs, []);
    const range = visibleRange("24h", nowMs);
    const buckets = bucketRuns(rows, range);
    const nonEmpty = buckets.filter((bucket) => bucket.total > 0);

    expect(nonEmpty.map((bucket) => bucket.total)).toEqual([1, 1]);
  });

  it("creates discrete bucket counts from the configured chunk size", () => {
    expect(bucketRuns([], visibleRange("12h", nowMs))).toHaveLength((12 * 60) / 5);
    expect(bucketRuns([], visibleRange("24h", nowMs))).toHaveLength((24 * 60) / 5);
    expect(bucketRuns([], visibleRange("7d", nowMs))).toHaveLength(7 * 24);
    expect(bucketRuns([], visibleRange("30d", nowMs))).toHaveLength(30);
  });

  it("formats relative tick labels", () => {
    const hourRange = visibleRange("12h", nowMs);
    const dayRange = visibleRange("7d", nowMs);

    expect(relativeTickLabel(nowMs, hourRange)).toBe("now");
    expect(relativeTickLabel(nowMs - 2 * 60 * 60 * 1000, hourRange)).toBe("2h ago");
    expect(relativeTickLabel(nowMs, dayRange)).toBe("today");
    expect(relativeTickLabel(nowMs - 2 * 24 * 60 * 60 * 1000, dayRange)).toBe("2d ago");
  });

  it("uses integer ticks only", () => {
    expect(integerTicks(3.2).every(Number.isInteger)).toBe(true);
    expect(integerTicks(10)).toEqual([0, 5, 10]);
    expect(integerTicks(0)).toEqual([0, 5, 10]);
  });
});

describe("run table search", () => {
  it("has searchable row fields for ids, status, tags, and platform", () => {
    const rows: RunTableRow[] = buildRunRows(runs, [
      {
        site_id: "site-1",
        user_id: "user-1",
        url: "https://nodekit.example/site-1",
        tags: ["pilot"],
        is_archived: false,
        timestamp_created: "2026-05-31T09:00:00Z",
      },
    ]);
    const searchable = rows.map(searchableRunText);

    expect(searchable.some((value) => value.includes("pilot"))).toBe(true);
    expect(searchable.some((value) => value.includes("prolific"))).toBe(true);
    expect(searchable.some((value) => value.includes("invalid"))).toBe(true);
  });

  it("matches full ids and lightweight context but not numeric/time fields", () => {
    const row = buildRunRows(
      [
        {
          run_id: "11111111-2222-3333-4444-555555555555",
          site_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          status: "submitted",
          is_archived: false,
          timestamp_created: "2026-05-31T10:15:00Z",
          event_count: 99,
          duration_msec: 1234,
          platform_label: "prolific",
        },
      ],
      [
        {
          site_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          user_id: "user-1",
          url: "https://nodekit.example/site-1",
          tags: ["pilot"],
          is_archived: false,
          timestamp_created: "2026-05-31T09:00:00Z",
        },
      ],
    )[0]!;

    expect(matchesRunSearch(row, "555555")).toBe(true);
    expect(matchesRunSearch(row, "EEEE")).toBe(true);
    expect(matchesRunSearch(row, "submitted")).toBe(true);
    expect(matchesRunSearch(row, "pilot")).toBe(true);
    expect(matchesRunSearch(row, "prolific")).toBe(true);
    expect(matchesRunSearch(row, "99")).toBe(false);
    expect(matchesRunSearch(row, "1234")).toBe(false);
    expect(matchesRunSearch(row, "May 31")).toBe(false);
  });
});

describe("run table pagination", () => {
  it("limits rendered pages to 100 rows", () => {
    const rows = Array.from({ length: 237 }, (_, index) => index);

    expect(RUNS_PAGE_SIZE).toBe(100);
    expect(pageRows(rows, 0)).toHaveLength(100);
    expect(pageRows(rows, 1)).toHaveLength(100);
    expect(pageRows(rows, 2)).toHaveLength(37);
    expect(pageInfo(rows.length, 0)).toMatchObject({
      pageIndex: 0,
      pageCount: 3,
      start: 1,
      end: 100,
      total: 237,
    });
  });

  it("filters rows to the current chart time window", () => {
    const rows = buildRunRows(
      [
        {
          run_id: "run-in",
          site_id: "site-1",
          status: "submitted",
          is_archived: false,
          timestamp_created: "2026-05-31T10:15:00Z",
        },
        {
          run_id: "run-out",
          site_id: "site-1",
          status: "submitted",
          is_archived: false,
          timestamp_created: "2026-05-30T10:15:00Z",
        },
      ],
      [],
    );
    const range = visibleRange("12h", nowMs);

    expect(rowsInTimeRange(rows, range).map((row) => row.runId)).toEqual(["run-in"]);
  });
});

describe("top bar helpers", () => {
  it("formats last refreshed with seconds and a timezone suffix", () => {
    const formatted = formatDateTimeWithZone("2026-05-31T12:34:56Z");

    expect(formatted).toContain("56");
    expect(formatted).toMatch(/\b(?:UTC|GMT|[A-Z]{2,5})\b/);
  });

  it("maps health states to classes and labels", () => {
    expect(healthClass({ status: "ok", checked_at: "now" })).toContain("health-ok");
    expect(healthClass({ status: "disconnected", checked_at: "now" })).toContain(
      "health-disconnected",
    );
    expect(healthClass({ status: "unreachable", checked_at: "now" })).toContain(
      "health-unreachable",
    );
    expect(healthLabel({ status: "ok", checked_at: "now" })).toBe("Server reachable");
  });
});
