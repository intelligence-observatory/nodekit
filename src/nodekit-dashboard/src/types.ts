export type RunStatus = "started" | "submitted" | "completed" | "invalid";

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface CacheMetadata {
  fetched_at: string;
  is_stale: boolean;
  stale_after_seconds: number | null;
}

export interface CacheStatus {
  cache_root: string;
  scope_key: string;
  db_path: string;
  source_api_url: string | null;
  has_client: boolean;
  cache_schema_version: number;
  last_refresh_at: string | null;
  counts: Record<string, number>;
}

export type HealthStatusKind = "ok" | "disconnected" | "unreachable";

export interface HealthStatus {
  status: HealthStatusKind;
  checked_at: string;
  message?: string;
}

export interface CachedSiteItem {
  site_id: string;
  user_id: string;
  url: string;
  tags: string[];
  is_archived: boolean;
  timestamp_created: string;
  _cache?: CacheMetadata;
}

export interface CachedTagItem {
  name: string;
  is_archived: boolean;
  timestamp_created: string;
  _cache?: CacheMetadata;
}

export interface CachedRunItem {
  run_id: string;
  site_id: string;
  status: RunStatus;
  is_archived: boolean;
  timestamp_created: string;
  trace_available?: boolean | null;
  event_count?: number | null;
  duration_msec?: number | null;
  platform_label?: string | null;
  _cache?: CacheMetadata;
}

export interface SiteDetail extends CachedSiteItem {
  graph: JsonValue;
  assets: JsonValue[];
}

export interface RunDetail extends CachedRunItem {
  site_submission: JsonValue | null;
  trace: Trace | null;
}

export interface Trace {
  graph?: JsonValue;
  events?: TraceEvent[];
  [key: string]: JsonValue | TraceEvent[] | undefined;
}

export interface TraceEvent {
  event_type?: string;
  t?: number;
  [key: string]: JsonValue | undefined;
}

export interface RunTableRow {
  runId: string;
  siteId: string;
  status: RunStatus;
  tags: string[];
  siteUrl: string | null;
  createdAt: string;
  createdAtMs: number;
  archived: boolean;
  traceAvailable: boolean | null;
  eventCount: number | null;
  durationMsec: number | null;
  platformLabel: string;
  cacheState: "fresh" | "stale" | "unknown";
  source: CachedRunItem;
}

export interface SiteTableRow {
  siteId: string;
  tags: string[];
  url: string;
  createdAt: string;
  createdAtMs: number;
  runCount: number;
  latestRunAt: string;
  latestRunAtMs: number;
  source: CachedSiteItem;
}

export interface DashboardData {
  status: CacheStatus;
  sites: CachedSiteItem[];
  tags: CachedTagItem[];
  runs: CachedRunItem[];
}

export type LookbackRange = "1h" | "1d" | "7d" | "30d";
export type RelativeLabelUnit = "hour" | "day";

export interface TimeRange {
  startMs: number;
  endMs: number;
  bucketMs: number;
  labelUnit: RelativeLabelUnit;
}

export interface TimeBounds {
  startMs: number;
  endMs: number;
}

export interface BucketRangeSelection {
  startIndex: number;
  endIndex: number;
}

export interface RunBucket {
  startMs: number;
  endMs: number;
  total: number;
  selectedTotal: number;
  runs: RunTableRow[];
  selectedRuns: RunTableRow[];
}
