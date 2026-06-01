import type { LookbackRange, RelativeLabelUnit, RunBucket, RunTableRow, TimeRange } from "./types";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const lookbackRanges: LookbackRange[] = ["1h", "24h", "7d", "30d"];

export function visibleRange(lookback: LookbackRange, nowMs = Date.now()): TimeRange {
  const durationMs = lookbackDurationMs(lookback);
  const bucketMs = bucketDurationMs(lookback);
  const bucketCount = Math.round(durationMs / bucketMs);
  const currentBucketStartMs = currentWallClockBucketStartMs(lookback, nowMs);
  const labelUnit: RelativeLabelUnit = lookback.endsWith("h") ? "hour" : "day";
  return {
    startMs: currentBucketStartMs - (bucketCount - 1) * bucketMs,
    endMs: nowMs,
    bucketMs,
    labelUnit,
  };
}

export function bucketRuns(
  rows: RunTableRow[],
  range: TimeRange,
  selectedRows: RunTableRow[] = [],
): RunBucket[] {
  const buckets = createEmptyBuckets(range);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.startMs, bucket]));
  for (const row of rows) {
    if (row.createdAtMs < range.startMs || row.createdAtMs > range.endMs) continue;

    const startMs = rowBucketStart(row.createdAtMs, range, buckets.length);
    const bucket = bucketMap.get(startMs);
    if (!bucket) continue;
    bucket.total += 1;
    bucket.runs.push(row);
  }
  for (const row of selectedRows) {
    if (row.createdAtMs < range.startMs || row.createdAtMs > range.endMs) continue;

    const startMs = rowBucketStart(row.createdAtMs, range, buckets.length);
    const bucket = bucketMap.get(startMs);
    if (!bucket) continue;
    bucket.selectedTotal += 1;
    bucket.selectedRuns.push(row);
  }
  return buckets;
}

export function relativeTickLabel(timestampMs: number, range: TimeRange): string {
  const diffMs = Math.max(0, range.endMs - timestampMs);
  if (range.labelUnit === "hour") {
    const hours = Math.round(diffMs / HOUR_MS);
    return hours === 0 ? "now" : `${hours}h ago`;
  }
  const days = Math.round(diffMs / DAY_MS);
  return days === 0 ? "today" : `${days}d ago`;
}

export function integerTicks(max: number): number[] {
  const safeMax = Math.max(1, Math.ceil(max));
  if (safeMax <= 10) return [0, 5, 10];
  const step = niceIntegerStep(safeMax / 4);
  const ticks = new Set<number>([0, safeMax]);
  for (let value = step; value < safeMax; value += step) ticks.add(value);
  return [...ticks].sort((a, b) => a - b);
}

function niceIntegerStep(target: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const normalized = target / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function createEmptyBuckets(range: TimeRange): RunBucket[] {
  const buckets: RunBucket[] = [];
  for (
    let startMs = range.startMs;
    startMs < range.endMs;
    startMs += range.bucketMs
  ) {
    const endMs = Math.min(startMs + range.bucketMs, range.endMs);
    if (endMs <= range.startMs) continue;
    buckets.push({ startMs, endMs, total: 0, selectedTotal: 0, runs: [], selectedRuns: [] });
  }
  return buckets;
}

function rowBucketStart(timestampMs: number, range: TimeRange, bucketCount: number): number {
  const bucketIndex = Math.min(
    bucketCount - 1,
    Math.floor((timestampMs - range.startMs) / range.bucketMs),
  );
  return range.startMs + bucketIndex * range.bucketMs;
}

function lookbackDurationMs(lookback: LookbackRange): number {
  if (lookback === "1h") return HOUR_MS;
  if (lookback === "24h") return 24 * HOUR_MS;
  if (lookback === "7d") return 7 * DAY_MS;
  return 30 * DAY_MS;
}

function bucketDurationMs(lookback: LookbackRange): number {
  if (lookback === "1h") return MINUTE_MS;
  if (lookback === "24h") return 15 * MINUTE_MS;
  if (lookback === "7d") return HOUR_MS;
  return DAY_MS;
}

function currentWallClockBucketStartMs(lookback: LookbackRange, nowMs: number): number {
  const date = new Date(nowMs);
  if (lookback === "1h") {
    date.setSeconds(0, 0);
  } else if (lookback === "24h") {
    date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0);
  } else if (lookback === "7d") {
    date.setMinutes(0, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  const bucketStartMs = date.getTime();
  if (nowMs === bucketStartMs) return bucketStartMs - bucketDurationMs(lookback);
  return bucketStartMs;
}
