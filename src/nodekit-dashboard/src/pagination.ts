import type { RunTableRow, TimeBounds } from "./types";

export const RUNS_PAGE_SIZE = 10;
export const SITES_PAGE_SIZE = 10;

export interface PageInfo {
  pageIndex: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
}

export function rowsInTimeRange(rows: RunTableRow[], range: TimeBounds): RunTableRow[] {
  return rows.filter((row) => row.createdAtMs >= range.startMs && row.createdAtMs <= range.endMs);
}

export function pageRows<T>(rows: T[], pageIndex: number, pageSize = RUNS_PAGE_SIZE): T[] {
  const safePageIndex = clampPageIndex(pageIndex, rows.length, pageSize);
  const start = safePageIndex * pageSize;
  return rows.slice(start, start + pageSize);
}

export function pageInfo(total: number, pageIndex: number, pageSize = RUNS_PAGE_SIZE): PageInfo {
  const safePageIndex = clampPageIndex(pageIndex, total, pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : safePageIndex * pageSize + 1;
  const end = Math.min(total, (safePageIndex + 1) * pageSize);
  return { pageIndex: safePageIndex, pageCount, start, end, total };
}

export function clampPageIndex(pageIndex: number, total: number, pageSize = RUNS_PAGE_SIZE): number {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return Math.max(0, Math.min(pageIndex, pageCount - 1));
}
