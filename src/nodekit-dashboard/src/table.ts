import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/table-core";

import type { RunTableRow } from "./types";

export interface RunsTableState {
  sorting: SortingState;
}

export const runColumns: ColumnDef<RunTableRow>[] = [
  { accessorKey: "runId", header: "Run ID" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "siteId", header: "Site" },
  { accessorFn: (row) => row.tags.join(", "), id: "tags", header: "Tags" },
  { accessorKey: "platformLabel", header: "Platform" },
  { accessorKey: "createdAtMs", header: "Created" },
  { accessorKey: "durationMsec", header: "Duration" },
  { accessorKey: "eventCount", header: "Events" },
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
