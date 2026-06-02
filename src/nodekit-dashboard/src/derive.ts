import type { CachedRunItem, CachedSiteItem, RunTableRow, SiteTableRow } from "./types";

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

export function buildSiteRows(
  sites: CachedSiteItem[],
  rows: RunTableRow[],
): SiteTableRow[] {
  const stats = new Map<string, { runCount: number; latestRunAt: string; latestRunAtMs: number }>();
  for (const row of rows) {
    const current = stats.get(row.siteId);
    if (!current) {
      stats.set(row.siteId, {
        runCount: 1,
        latestRunAt: row.createdAt,
        latestRunAtMs: row.createdAtMs,
      });
      continue;
    }
    current.runCount += 1;
    if (row.createdAtMs > current.latestRunAtMs) {
      current.latestRunAt = row.createdAt;
      current.latestRunAtMs = row.createdAtMs;
    }
  }

  return sites
    .flatMap((site) => {
      const siteStats = stats.get(site.site_id);
      if (!siteStats) return [];
      const createdAtMs = Date.parse(site.timestamp_created);
      return [
        {
          siteId: site.site_id,
          tags: site.tags,
          url: site.url,
          createdAt: site.timestamp_created,
          createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : 0,
          runCount: siteStats.runCount,
          latestRunAt: siteStats.latestRunAt,
          latestRunAtMs: siteStats.latestRunAtMs,
          source: site,
        },
      ];
    })
    .sort((a, b) => b.runCount - a.runCount || b.latestRunAtMs - a.latestRunAtMs);
}
