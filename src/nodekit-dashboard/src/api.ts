import type {
  CacheStatus,
  CachedRunItem,
  CachedSiteItem,
  DashboardData,
  HealthStatus,
  RunDashboardFilters,
  TimeBounds,
} from "./types";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    const detail = payload?.detail;
    if (typeof detail === "string") throw new Error(detail);
    if (detail?.message) throw new Error(detail.message);
    throw new Error(`Request failed: ${response.status}`);
  }
  return payload as T;
}

export async function fetchDashboardData(
  range: TimeBounds,
  filters: RunDashboardFilters,
): Promise<DashboardData> {
  const query = new URLSearchParams({
    start_ms: String(Math.floor(range.startMs)),
    end_ms: String(Math.floor(range.endMs)),
  });
  appendQueryValues(query, "recruitment_platforms", filters.recruitmentPlatforms);
  appendQueryValues(query, "recruiter_study_ids", filters.recruiterStudyIds);
  appendQueryValues(query, "recruiter_participant_ids", filters.recruiterParticipantIds);
  appendQueryValues(query, "recruiter_session_ids", filters.recruiterSessionIds);
  const [status, sites, runs] = await Promise.all([
    requestJson<CacheStatus>("/api/status"),
    requestJson<CachedSiteItem[]>("/api/sites"),
    requestJson<CachedRunItem[]>(`/api/runs?${query}`),
  ]);
  return { status, sites, tags: [], runs };
}

function appendQueryValues(query: URLSearchParams, key: string, values: string[]): void {
  for (const value of values) query.append(key, value);
}

export async function refreshDashboard(): Promise<unknown> {
  return requestJson<unknown>("/api/refresh", { method: "POST" });
}

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch("/api/health");
  const payload = (await response.json()) as HealthStatus;
  return payload;
}
