import { describe, expect, it } from "vitest";

import { buildRunRows, buildSiteRows, filterRowsBySiteIds } from "../src/derive";
import { formatDateTimeWithZone } from "../src/format";
import { healthClass, healthLabel } from "../src/health";
import {
  pageInfo,
  pageRows,
  rowsInTimeRange,
  RUNS_PAGE_SIZE,
  SITES_PAGE_SIZE,
} from "../src/pagination";
import {
  matchesRunSearch,
  matchesSiteSearch,
  searchableRunText,
  searchableSiteText,
} from "../src/search";
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
  it("creates a 1 hour range ending at present", () => {
    const range = visibleRange("1h", nowMs);

    expect(range.labelUnit).toBe("hour");
    expect(range.bucketMs).toBe(60 * 1000);
    expect(range.endMs).toBe(nowMs);
    expect(range.startMs).toBe(nowMs - 60 * 60 * 1000);
  });

  it("aligns buckets to wall-clock boundaries without extending into the future", () => {
    const unalignedNowMs = Date.parse("2026-05-31T12:37:45Z");

    const oneHourBuckets = bucketRuns([], visibleRange("1h", unalignedNowMs));
    expect(oneHourBuckets).toHaveLength(60);
    expect(new Date(oneHourBuckets[0]!.startMs).getSeconds()).toBe(0);
    expect(new Date(oneHourBuckets.at(-1)!.startMs).getSeconds()).toBe(0);
    expect(oneHourBuckets.at(-1)!.endMs).toBe(unalignedNowMs);

    const dayBuckets = bucketRuns([], visibleRange("1d", unalignedNowMs));
    expect(dayBuckets).toHaveLength(96);
    expect(new Date(dayBuckets.at(-1)!.startMs).getMinutes() % 15).toBe(0);
    expect(new Date(dayBuckets.at(-1)!.startMs).getSeconds()).toBe(0);
    expect(dayBuckets.at(-1)!.endMs).toBe(unalignedNowMs);

    const weekBuckets = bucketRuns([], visibleRange("7d", unalignedNowMs));
    expect(new Date(weekBuckets.at(-1)!.startMs).getMinutes()).toBe(0);
    expect(new Date(weekBuckets.at(-1)!.startMs).getSeconds()).toBe(0);

    const monthBuckets = bucketRuns([], visibleRange("30d", unalignedNowMs));
    expect(new Date(monthBuckets.at(-1)!.startMs).getHours()).toBe(0);
    expect(new Date(monthBuckets.at(-1)!.startMs).getMinutes()).toBe(0);
  });

  it("uses the requested fixed bucket sizes for each lookback", () => {
    expect(visibleRange("1d", nowMs).bucketMs).toBe(15 * 60 * 1000);
    expect(visibleRange("7d", nowMs).bucketMs).toBe(60 * 60 * 1000);
    expect(visibleRange("30d", nowMs).bucketMs).toBe(24 * 60 * 60 * 1000);
    expect(visibleRange("7d", nowMs).labelUnit).toBe("day");
    expect(visibleRange("30d", nowMs).labelUnit).toBe("day");
  });

  it("never creates buckets that end in the future", () => {
    const rows = buildRunRows(runs, []);
    const range = visibleRange("1h", nowMs);
    const buckets = bucketRuns(rows, range);

    expect(buckets.at(-1)?.endMs).toBe(nowMs);
    expect(Math.max(...buckets.map((bucket) => bucket.endMs))).toBe(nowMs);
  });

  it("counts total runs without status splitting", () => {
    const rows = buildRunRows(runs, []);
    const range = visibleRange("1d", nowMs);
    const buckets = bucketRuns(rows, range);
    const nonEmpty = buckets.filter((bucket) => bucket.total > 0);

    expect(nonEmpty.map((bucket) => bucket.total)).toEqual([1, 1]);
  });

  it("counts selected site runs without changing global bucket counts", () => {
    const rows = buildRunRows(runs, []);
    const range = visibleRange("1d", nowMs);
    const selectedRows = filterRowsBySiteIds(rows, new Set(["site-1"]));
    const buckets = bucketRuns(rows, range, selectedRows);

    expect(buckets.reduce((sum, bucket) => sum + bucket.total, 0)).toBe(2);
    expect(buckets.reduce((sum, bucket) => sum + bucket.selectedTotal, 0)).toBe(2);
    expect(bucketRuns(rows, range).every((bucket) => bucket.selectedTotal === 0)).toBe(true);
  });

  it("creates discrete bucket counts from the configured chunk size", () => {
    expect(bucketRuns([], visibleRange("1h", nowMs))).toHaveLength(60);
    expect(bucketRuns([], visibleRange("1d", nowMs))).toHaveLength((24 * 60) / 15);
    expect(bucketRuns([], visibleRange("7d", nowMs))).toHaveLength(7 * 24);
    expect(bucketRuns([], visibleRange("30d", nowMs))).toHaveLength(30);
  });

  it("formats relative tick labels", () => {
    const hourRange = visibleRange("1h", nowMs);
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

describe("site table lens", () => {
  it("derives site run counts and latest run timestamps from windowed runs", () => {
    const rows = buildRunRows(runs, [
      {
        site_id: "site-1",
        user_id: "user-1",
        url: "https://nodekit.example/site-1",
        tags: ["pilot"],
        is_archived: false,
        timestamp_created: "2026-05-31T09:00:00Z",
      },
      {
        site_id: "site-2",
        user_id: "user-1",
        url: "https://nodekit.example/site-2",
        tags: ["qa"],
        is_archived: false,
        timestamp_created: "2026-05-29T09:00:00Z",
      },
    ]);
    const range = visibleRange("1d", nowMs);
    const siteRows = buildSiteRows(
      [
        {
          site_id: "site-1",
          user_id: "user-1",
          url: "https://nodekit.example/site-1",
          tags: ["pilot"],
          is_archived: false,
          timestamp_created: "2026-05-31T09:00:00Z",
        },
        {
          site_id: "site-2",
          user_id: "user-1",
          url: "https://nodekit.example/site-2",
          tags: ["qa"],
          is_archived: false,
          timestamp_created: "2026-05-29T09:00:00Z",
        },
      ],
      rowsInTimeRange(rows, range),
    );

    expect(siteRows).toHaveLength(1);
    expect(siteRows[0]).toMatchObject({
      siteId: "site-1",
      runCount: 2,
      latestRunAt: "2026-05-31T11:15:00Z",
    });
  });

  it("searches site id, tags, and url", () => {
    const [row] = buildSiteRows(
      [
        {
          site_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          user_id: "user-1",
          url: "https://nodekit.example/sites/alpha",
          tags: ["pilot", "attention"],
          is_archived: false,
          timestamp_created: "2026-05-31T09:00:00Z",
        },
      ],
      [
        {
          runId: "run-1",
          siteId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          status: "submitted",
          tags: ["pilot", "attention"],
          siteUrl: "https://nodekit.example/sites/alpha",
          createdAt: "2026-05-31T11:15:00Z",
          createdAtMs: Date.parse("2026-05-31T11:15:00Z"),
          archived: false,
          traceAvailable: null,
          eventCount: null,
          durationMsec: null,
          platformLabel: "unknown",
          cacheState: "unknown",
          source: runs[0]!,
        },
      ],
    );

    expect(searchableSiteText(row!)).toContain("attention");
    expect(matchesSiteSearch(row!, "EEEE")).toBe(true);
    expect(matchesSiteSearch(row!, "pilot")).toBe(true);
    expect(matchesSiteSearch(row!, "alpha")).toBe(true);
    expect(matchesSiteSearch(row!, "submitted")).toBe(false);
  });

  it("filters runs to selected visible site ids", () => {
    const rows = buildRunRows(runs, []);

    expect(filterRowsBySiteIds(rows, new Set(["site-1"])).map((row) => row.runId)).toEqual([
      "run-2",
      "run-1",
    ]);
    expect(filterRowsBySiteIds(rows, new Set()).map((row) => row.runId)).toEqual([
      "run-2",
      "run-1",
      "run-3",
    ]);
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
    expect(SITES_PAGE_SIZE).toBe(100);
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
          timestamp_created: "2026-05-31T12:15:00Z",
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
    const range = visibleRange("1h", nowMs);

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
