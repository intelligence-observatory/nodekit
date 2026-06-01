import type { SortingState } from "@tanstack/table-core";

import { fetchDashboardData, fetchHealth, refreshDashboard } from "./api";
import { renderRunChart, type RunChartController } from "./chart";
import { buildRunRows } from "./derive";
import { formatDateTimeWithZone, localTimeZoneLabel } from "./format";
import { healthClass, healthLabel } from "./health";
import { icon } from "./icons";
import { pageInfo, pageRows, rowsInTimeRange } from "./pagination";
import { matchesRunSearch } from "./search";
import "./styles.css";
import { createRunsTable } from "./table";
import { bucketRuns, lookbackRanges, visibleRange } from "./time-buckets";
import type {
  CachedRunItem,
  CachedSiteItem,
  CacheStatus,
  HealthStatus,
  LookbackRange,
  RunStatus,
  RunTableRow,
} from "./types";

const HEALTH_POLL_INTERVAL_MS = 30_000;

interface AppState {
  status: CacheStatus | null;
  health: HealthStatus | null;
  runs: CachedRunItem[];
  sites: CachedSiteItem[];
  rows: RunTableRow[];
  sorting: SortingState;
  lookback: LookbackRange;
  search: string;
  pageIndex: number;
  error: string | null;
  loading: boolean;
}

const state: AppState = {
  status: null,
  health: null,
  runs: [],
  sites: [],
  rows: [],
  sorting: [{ id: "createdAtMs", desc: true }],
  lookback: "12h",
  search: "",
  pageIndex: 0,
  error: null,
  loading: false,
};

let chartController: RunChartController | null = null;
let lastChartWidth = 0;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app mount point.");

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-title">NodeKit Dashboard</div>
        <div class="brand-meta">
          <span id="health-light" class="health-light health-disconnected"></span>
          <span id="brand-meta"></span>
        </div>
      </div>
      <div class="topbar-actions">
        <div id="cache-line" class="cache-line"></div>
        <button
          id="refresh"
          class="quiet-icon-button"
          type="button"
          title="Refresh cached data"
          aria-label="Refresh cached data"
        >${icon("refreshCw")}</button>
      </div>
    </header>
    <main class="content">
      <section class="panel">
        <div class="panel-header">
          <h2>Run Volume</h2>
          <div id="range-pills" class="range-pills" aria-label="Histogram range"></div>
        </div>
        <div id="chart" class="chart-wrap"></div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Runs</h2>
          <label class="search-field">
            ${icon("search")}
            <input
              id="search-filter"
              type="search"
              placeholder="Search Runs"
              title="Searches full Run ID, full Site ID, status, tags, and platform."
              aria-label="Search full Run ID, full Site ID, status, tags, and platform"
            />
          </label>
        </div>
        <div id="error" class="error"></div>
        <div id="runs-table" class="table-wrap"></div>
        <div id="runs-pager" class="pager"></div>
      </section>
    </main>
  </div>
`;

bindStaticControls();
bindChartResize();
void loadData();
void loadHealth();
window.setInterval(() => void loadHealth(), HEALTH_POLL_INTERVAL_MS);

function bindStaticControls(): void {
  byId("refresh").addEventListener("click", () => void manualRefresh());
  input("search-filter").addEventListener("input", (event) => {
    state.search = (event.target as HTMLInputElement).value;
    state.pageIndex = 0;
    render();
  });
}

function bindChartResize(): void {
  const host = byId("chart");
  if (!("ResizeObserver" in window)) return;
  const observer = new ResizeObserver(() => {
    const width = Math.round(host.clientWidth);
    if (width <= 0 || width === lastChartWidth) return;
    lastChartWidth = width;
    renderChart(chartWindowRows());
  });
  observer.observe(host);
}

async function loadData(): Promise<void> {
  state.loading = true;
  state.error = null;
  try {
    const data = await fetchDashboardData();
    state.status = data.status;
    state.runs = data.runs.filter((run) => !run.is_archived);
    state.sites = data.sites;
    state.rows = buildRunRows(state.runs, state.sites);
    state.pageIndex = 0;
  } catch (error) {
    state.error = errorMessage(error);
  } finally {
    state.loading = false;
    render();
  }
}

async function loadHealth(): Promise<void> {
  try {
    state.health = await fetchHealth();
  } catch (error) {
    state.health = {
      status: "unreachable",
      checked_at: new Date().toISOString(),
      message: errorMessage(error),
    };
  }
  renderTopbar();
}

async function manualRefresh(): Promise<void> {
  state.loading = true;
  state.error = null;
  render();
  try {
    await refreshDashboard();
    await loadData();
  } catch (error) {
    state.error = errorMessage(error);
    state.loading = false;
    render();
  }
}

function render(): void {
  const chartRows = chartWindowRows();
  const rows = filteredRows(chartRows);
  renderTopbar();
  renderRangePills();
  renderChart(chartRows);
  renderRunsTable(rows);
  byId("error").textContent = state.error ?? "";
}

function renderTopbar(): void {
  byId("brand-meta").textContent = state.status?.source_api_url
    ? `Source: ${state.status.source_api_url}`
    : "Cache-only shell";
  const healthLight = byId("health-light");
  healthLight.className = healthClass(state.health);
  healthLight.title = healthLabel(state.health);
  healthLight.setAttribute("aria-label", healthLabel(state.health));
  byId("cache-line").textContent = state.status?.last_refresh_at
    ? `Last refreshed ${formatDateTimeWithZone(state.status.last_refresh_at)}`
    : `No refresh recorded (${localTimeZoneLabel()})`;
  const refreshButton = byId("refresh") as HTMLButtonElement;
  refreshButton.disabled = state.loading || state.status?.has_client === false;
  refreshButton.classList.toggle("is-refreshing", state.loading);
}

function renderRangePills(): void {
  const host = byId("range-pills");
  host.replaceChildren();
  for (const range of lookbackRanges) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `range-pill ${state.lookback === range ? "selected" : ""}`;
    button.textContent = range;
    button.addEventListener("click", () => {
      state.lookback = range;
      state.pageIndex = 0;
      render();
    });
    host.append(button);
  }
}

function renderChart(rows: RunTableRow[]): void {
  chartController?.destroy();
  const range = visibleRange(state.lookback);
  const buckets = bucketRuns(rows, range);
  chartController = renderRunChart(byId("chart"), buckets, range);
  lastChartWidth = Math.round(byId("chart").clientWidth);
}

function renderRunsTable(rows: RunTableRow[]): void {
  const table = createRunsTable(rows, { sorting: state.sorting }, (sorting) => {
    state.sorting = sorting;
    state.pageIndex = 0;
    render();
  });
  const sortedRows = table.getRowModel().rows;
  const info = pageInfo(sortedRows.length, state.pageIndex);
  state.pageIndex = info.pageIndex;
  const visibleRows = pageRows(sortedRows, state.pageIndex);

  const html = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const header of table.getHeaderGroups()[0]?.headers ?? []) {
    const th = document.createElement("th");
    th.textContent = String(header.column.columnDef.header ?? header.id);
    const sortingHandler = header.column.getToggleSortingHandler();
    if (sortingHandler) th.addEventListener("click", sortingHandler);
    headerRow.append(th);
  }
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  for (const row of visibleRows) {
    const source = row.original;
    const tr = document.createElement("tr");
    tr.append(
      textCell(shortId(source.runId), source.runId),
      statusCell(source.status),
      textCell(shortId(source.siteId), source.siteId),
      textCell(source.tags.join(", ") || "none"),
      textCell(source.platformLabel),
      textCell(formatDateTime(source.createdAt)),
      textCell(formatDuration(source.durationMsec)),
      textCell(source.eventCount === null ? "" : String(source.eventCount)),
    );
    tbody.append(tr);
  }
  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = textCell("No cached Runs match this view.");
    td.colSpan = 8;
    tr.append(td);
    tbody.append(tr);
  }
  html.append(thead, tbody);
  byId("runs-table").replaceChildren(html);
  renderPager(info);
}

function renderPager(info: ReturnType<typeof pageInfo>): void {
  const host = byId("runs-pager");
  const rangeLabel = state.lookback;
  host.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "pager-summary";
  summary.textContent =
    info.total === 0
      ? `Showing 0 of 0 Runs in last ${rangeLabel}`
      : `Showing ${info.start}-${info.end} of ${info.total} Runs in last ${rangeLabel}`;

  const controls = document.createElement("div");
  controls.className = "pager-controls";
  const previous = pagerButton("Previous", info.pageIndex === 0, () => {
    state.pageIndex = Math.max(0, state.pageIndex - 1);
    render();
  });
  const label = document.createElement("span");
  label.className = "pager-page";
  label.textContent = `Page ${info.pageIndex + 1} of ${info.pageCount}`;
  const next = pagerButton("Next", info.pageIndex >= info.pageCount - 1, () => {
    state.pageIndex = Math.min(info.pageCount - 1, state.pageIndex + 1);
    render();
  });
  controls.append(previous, label, next);
  host.append(summary, controls);
}

function pagerButton(label: string, disabled: boolean, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function chartWindowRows(): RunTableRow[] {
  return rowsInTimeRange(state.rows, visibleRange(state.lookback));
}

function filteredRows(rows: RunTableRow[]): RunTableRow[] {
  return rows.filter((row) => matchesRunSearch(row, state.search));
}

function statusCell(status: RunStatus): HTMLTableCellElement {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.className = `status-badge status-${status}`;
  span.textContent = status;
  td.append(span);
  return td;
}

function textCell(text: string, title?: string): HTMLTableCellElement {
  const td = document.createElement("td");
  td.textContent = text;
  if (title) td.title = title;
  return td;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(durationMsec: number | null): string {
  if (durationMsec === null) return "";
  if (durationMsec < 1000) return `${Math.round(durationMsec)} ms`;
  const seconds = durationMsec / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

function shortId(value: string): string {
  return value.length > 8 ? value.slice(0, 8) : value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function byId(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element: ${id}`);
  return element;
}

function input(id: string): HTMLInputElement {
  return byId(id) as HTMLInputElement;
}
