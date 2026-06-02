import type { RunTableRow, SiteTableRow } from "./types";

export function searchableRunText(row: RunTableRow): string {
  return [
    row.runId,
    row.siteId,
    row.status,
    row.tags.join(" "),
    row.platformLabel,
    row.recruiterStudyId ?? "",
    row.recruiterParticipantId ?? "",
    row.recruiterSessionId ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesRunSearch(row: RunTableRow, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  return normalized === "" || searchableRunText(row).includes(normalized);
}

export function searchableSiteText(row: SiteTableRow): string {
  return [row.siteId, row.tags.join(" "), row.url].join(" ").toLowerCase();
}

export function matchesSiteSearch(row: SiteTableRow, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  return normalized === "" || searchableSiteText(row).includes(normalized);
}
