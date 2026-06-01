import type { RunTableRow } from "./types";

export function searchableRunText(row: RunTableRow): string {
  return [row.runId, row.siteId, row.status, row.tags.join(" "), row.platformLabel]
    .join(" ")
    .toLowerCase();
}

export function matchesRunSearch(row: RunTableRow, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  return normalized === "" || searchableRunText(row).includes(normalized);
}
