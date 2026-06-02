import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/table-core";

import type { RunTableRow, SiteTableRow } from "./types";

export interface RunsTableState {
  sorting: SortingState;
}

export const runColumns: ColumnDef<RunTableRow>[] = [
  { accessorKey: "runId", header: "Run ID" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "siteId", header: "Site" },
  { accessorFn: (row) => row.tags.join(", "), id: "tags", header: "Tags" },
  { accessorKey: "platformLabel", header: "Platform" },
  { accessorKey: "recruiterStudyId", header: "Study/HIT" },
  { accessorKey: "recruiterParticipantId", header: "Participant" },
  { accessorKey: "recruiterSessionId", header: "Session" },
  { accessorKey: "createdAtMs", header: "Created" },
  { accessorKey: "createdAt", header: "Creation Date" },
  { accessorKey: "durationMsec", header: "Duration" },
  { accessorKey: "eventCount", header: "Events" },
];

export const siteColumns: ColumnDef<SiteTableRow>[] = [
  { accessorKey: "siteId", header: "Site" },
  { accessorFn: (row) => row.tags.join(", "), id: "tags", header: "Tags" },
  { accessorKey: "runCount", header: "Runs" },
  { accessorKey: "latestRunAtMs", header: "Latest Run" },
  { accessorKey: "createdAtMs", header: "Created" },
  { accessorKey: "createdAt", header: "Creation Date" },
  { accessorKey: "url", header: "URL" },
];

export function createRunsTable(
  rows: RunTableRow[],
  state: RunsTableState,
  onSortingChange: (sorting: SortingState) => void,
) {
  return createTable({
    data: rows,
    columns: runColumns,
    state: { ...state, columnPinning: { left: [], right: [] } },
    getRowId: (row) => row.runId,
    onStateChange: () => {},
    onSortingChange: (updater) => {
      onSortingChange(typeof updater === "function" ? updater(state.sorting) : updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    renderFallbackValue: "",
  });
}

export function createSitesTable(
  rows: SiteTableRow[],
  state: RunsTableState,
  onSortingChange: (sorting: SortingState) => void,
) {
  return createTable({
    data: rows,
    columns: siteColumns,
    state: { ...state, columnPinning: { left: [], right: [] } },
    getRowId: (row) => row.siteId,
    onStateChange: () => {},
    onSortingChange: (updater) => {
      onSortingChange(typeof updater === "function" ? updater(state.sorting) : updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    renderFallbackValue: "",
  });
}
