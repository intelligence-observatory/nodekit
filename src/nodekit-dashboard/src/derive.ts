import type { CachedRunItem, CachedSiteItem, RunTableRow } from "./types";

export function buildRunRows(
  runs: CachedRunItem[],
  sites: CachedSiteItem[],
): RunTableRow[] {
  const sitesById = new Map(sites.map((site) => [site.site_id, site]));
  return runs
    .map((run) => {
      const site = sitesById.get(run.site_id);
      const createdAtMs = Date.parse(run.timestamp_created);
      const cacheState: RunTableRow["cacheState"] = run._cache
        ? run._cache.is_stale
          ? "stale"
          : "fresh"
        : "unknown";
      return {
        runId: run.run_id,
        siteId: run.site_id,
        status: run.status,
        tags: site?.tags ?? [],
        siteUrl: site?.url ?? null,
        createdAt: run.timestamp_created,
        createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : 0,
        archived: run.is_archived,
        traceAvailable: run.trace_available ?? null,
        eventCount: run.event_count ?? null,
        durationMsec: run.duration_msec ?? null,
        platformLabel: run.platform_label ?? "unknown",
        cacheState,
        source: run,
      };
    })
    .sort((a, b) => b.createdAtMs - a.createdAtMs);
}
