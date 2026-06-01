import type { Header, SortingState } from "@tanstack/table-core";

import { fetchDashboardData, fetchHealth, refreshDashboard } from "./api";
import { renderRunChart, type RunChartController } from "./chart";
import { buildRunRows, buildSiteRows, filterRowsBySiteIds } from "./derive";
import { formatDateTimeWithZone, localTimeZoneLabel } from "./format";
import { healthClass, healthLabel } from "./health";
import { icon } from "./icons";
import { pageInfo, pageRows, rowsInTimeRange, SITES_PAGE_SIZE } from "./pagination";
import { matchesRunSearch, matchesSiteSearch } from "./search";
import "./styles.css";
import { createRunsTable, createSitesTable } from "./table";
import {
  bucketRuns,
  lookbackRanges,
  selectedBucketTimeRange,
  visibleRange,
} from "./time-buckets";
import type {
  BucketRangeSelection,
  CachedRunItem,
  CachedSiteItem,
  CacheStatus,
  HealthStatus,
  LookbackRange,
  RunStatus,
  RunTableRow,
  SiteTableRow,
} from "./types";

const HEALTH_POLL_INTERVAL_MS = 30_000;

interface AppState {
  status: CacheStatus | null;
  health: HealthStatus | null;
  runs: CachedRunItem[];
  sites: CachedSiteItem[];
  rows: RunTableRow[];
  sorting: SortingState;
  siteSorting: SortingState;
  lookback: LookbackRange;
  search: string;
  siteSearch: string;
  pageIndex: number;
  sitePageIndex: number;
  selectedSiteIds: Set<string>;
  selectedBucketRange: BucketRangeSelection | null;
  hasInitializedSiteSelection: boolean;
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
  siteSorting: [
    { id: "runCount", desc: true },
    { id: "latestRunAtMs", desc: true },
  ],
  lookback: "1h",
  search: "",
  siteSearch: "",
  pageIndex: 0,
  sitePageIndex: 0,
  selectedSiteIds: new Set(),
  selectedBucketRange: null,
  hasInitializedSiteSelection: false,
  error: null,
  loading: false,
};

let chartController: RunChartController | null = null;
let lastChartWidth = 0;
let chartInteractionEpoch = 0;

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
        <button id="reset-view" class="quiet-text-button" type="button">Reset view</button>
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
          <h2>Run Volume <span id="run-volume-title-meta" class="title-meta"></span></h2>
          <div id="range-pills" class="range-pills" aria-label="Histogram range"></div>
        </div>
        <div id="chart" class="chart-wrap"></div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Sites <span id="sites-title-meta" class="title-meta"></span></h2>
          <label class="search-field">
            ${icon("search")}
            <input
              id="site-search-filter"
              type="search"
              placeholder="Search Sites"
              title="Searches full Site ID, tags, and URL."
              aria-label="Search full Site ID, tags, and URL"
            />
          </label>
        </div>
        <div id="sites-table" class="table-wrap"></div>
        <div id="sites-pager" class="pager"></div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Runs <span id="runs-title-meta" class="title-meta"></span></h2>
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
  byId("reset-view").addEventListener("click", resetView);
  byId("refresh").addEventListener("click", () => void manualRefresh());
  input("search-filter").addEventListener("input", (event) => {
    state.search = (event.target as HTMLInputElement).value;
    state.pageIndex = 0;
    render();
  });
  input("site-search-filter").addEventListener("input", (event) => {
    state.siteSearch = (event.target as HTMLInputElement).value;
    state.sitePageIndex = 0;
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
    const fullRange = visibleRange(state.lookback);
    const activeRange = selectedBucketTimeRange(fullRange, state.selectedBucketRange);
    const chartRows = rowsInTimeRange(state.rows, fullRange);
    const activeRows = rowsInTimeRange(state.rows, activeRange);
    const sites = filteredSiteRows(buildSiteRows(state.sites, activeRows));
    const selectedSiteIds = visibleSelectedSiteIds(sites);
    renderChart(
      chartRows,
      selectedSiteIds.size === 0 ? [] : filterRowsBySiteIds(activeRows, selectedSiteIds),
      sites.length > 0,
    );
  });
  observer.observe(host);
}

async function loadData(): Promise<void> {
  state.loading = true;
  state.error = null;
  try {
    const data = await fetchDashboardData();
    const wasAllSitesSelected =
      state.sites.length === 0 ||
      state.sites.every((site) => state.selectedSiteIds.has(site.site_id));
    state.status = data.status;
    state.runs = data.runs.filter((run) => !run.is_archived);
    state.sites = data.sites;
    state.rows = buildRunRows(state.runs, state.sites);
    if (!state.hasInitializedSiteSelection || wasAllSitesSelected) {
      state.selectedSiteIds = new Set(state.sites.map((site) => site.site_id));
    } else {
      const currentSiteIds = new Set(state.sites.map((site) => site.site_id));
      state.selectedSiteIds = new Set(
        [...state.selectedSiteIds].filter((siteId) => currentSiteIds.has(siteId)),
      );
    }
    state.hasInitializedSiteSelection = true;
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
  const fullRange = visibleRange(state.lookback);
  const activeRange = selectedBucketTimeRange(fullRange, state.selectedBucketRange);
  const chartRows = rowsInTimeRange(state.rows, fullRange);
  const activeRows = rowsInTimeRange(state.rows, activeRange);
  const activeSites = buildSiteRows(state.sites, activeRows);
  const sites = filteredSiteRows(activeSites);
  const selectedSiteIds = visibleSelectedSiteIds(sites);
  const selectedRows =
    selectedSiteIds.size === 0 ? [] : filterRowsBySiteIds(activeRows, selectedSiteIds);
  const rows = filteredRows(filterRowsBySiteIds(activeRows, selectedSiteIds));
  renderTopbar();
  renderTitleMetadata(activeRows.length, activeSites.length, activeRange);
  renderRangePills();
  renderChart(chartRows, selectedRows, sites.length > 0);
  renderSitesTable(sites);
  renderRunsTable(rows);
  byId("error").textContent = state.error ?? "";
}

function renderTitleMetadata(
  runCount: number,
  siteCount: number,
  activeRange: ReturnType<typeof visibleRange>,
): void {
  const label = activeWindowLabel(activeRange);
  byId("run-volume-title-meta").textContent = `(n=${runCount} in ${label})`;
  byId("sites-title-meta").textContent = `(n=${siteCount} active in ${label})`;
  byId("runs-title-meta").textContent = `(n=${runCount} in ${label})`;
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
      changeLookback(range);
    });
    host.append(button);
  }
}

function renderChart(
  rows: RunTableRow[],
  selectedRows: RunTableRow[],
  siteLensVisible: boolean,
): void {
  const epoch = ++chartInteractionEpoch;
  chartController?.destroy();
  const range = visibleRange(state.lookback);
  const buckets = bucketRuns(rows, range, selectedRows);
  chartController = renderRunChart(byId("chart"), buckets, range, siteLensVisible, {
    selectedBucketRange: state.selectedBucketRange,
    onBucketSelect(selection) {
      if (epoch !== chartInteractionEpoch) return;
      state.selectedBucketRange = selection;
      selectAllActiveSitesInCurrentView();
      state.pageIndex = 0;
      state.sitePageIndex = 0;
      render();
    },
  });
  lastChartWidth = Math.round(byId("chart").clientWidth);
}

function changeLookback(range: LookbackRange): void {
  chartInteractionEpoch += 1;
  state.lookback = range;
  state.selectedBucketRange = null;
  selectAllSitesInRange(visibleRange(range));
  state.pageIndex = 0;
  state.sitePageIndex = 0;
  render();
}

function renderSitesTable(rows: SiteTableRow[]): void {
  const table = createSitesTable(rows, { sorting: state.siteSorting }, (sorting) => {
    state.siteSorting = sorting;
    state.sitePageIndex = 0;
    state.pageIndex = 0;
    render();
  });
  const sortedRows = table.getRowModel().rows;
  const info = pageInfo(sortedRows.length, state.sitePageIndex, SITES_PAGE_SIZE);
  state.sitePageIndex = info.pageIndex;
  const visibleRows = pageRows(sortedRows, state.sitePageIndex, SITES_PAGE_SIZE);

  const html = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const header of table.getHeaderGroups()[0]?.headers ?? []) {
    const th = document.createElement("th");
    if (header.id === "select") {
      th.className = "select-column";
      th.append(selectAllCell(rows));
    } else {
      appendSortHeader(th, header);
      const sortingHandler = header.column.getToggleSortingHandler();
      if (sortingHandler) th.addEventListener("click", sortingHandler);
    }
    headerRow.append(th);
  }
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  for (const row of visibleRows) {
    const source = row.original;
    const isSelected = state.selectedSiteIds.has(source.siteId);
    const tr = document.createElement("tr");
    tr.className = isSelected ? "selected-row" : "";
    tr.append(
      selectCell(source.siteId, isSelected),
      textCell(shortId(source.siteId), source.siteId),
      textCell(source.tags.join(", ") || "none"),
      textCell(String(source.runCount)),
      textCell(formatDateTime(source.latestRunAt)),
      textCell(formatDateTime(source.createdAt)),
      urlCell(source.url),
    );
    tbody.append(tr);
  }
  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = textCell("No cached Sites have Runs in this window.");
    td.colSpan = 7;
    tr.append(td);
    tbody.append(tr);
  }
  html.append(thead, tbody);
  byId("sites-table").replaceChildren(html);
  renderSitesPager(info, rows);
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
    appendSortHeader(th, header);
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

function renderSitesPager(info: ReturnType<typeof pageInfo>, rows: SiteTableRow[]): void {
  const host = byId("sites-pager");
  host.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "pager-summary";
  summary.textContent =
    info.total === 0
      ? "Showing 0 of 0 selected"
      : `Showing ${info.start}-${info.end} of ${info.total} selected`;

  const controls = document.createElement("div");
  controls.className = "pager-controls";
  const selected = document.createElement("span");
  selected.className = "pager-page";
  selected.textContent = `${visibleSelectedSiteIds(rows).size} Sites selected`;
  const previous = pagerButton("Previous", info.pageIndex === 0, () => {
    state.sitePageIndex = Math.max(0, state.sitePageIndex - 1);
    render();
  });
  const label = document.createElement("span");
  label.className = "pager-page";
  label.textContent = `Page ${info.pageIndex + 1} of ${info.pageCount}`;
  const next = pagerButton("Next", info.pageIndex >= info.pageCount - 1, () => {
    state.sitePageIndex = Math.min(info.pageCount - 1, state.sitePageIndex + 1);
    render();
  });
  controls.append(selected, previous, label, next);
  host.append(summary, controls);
}

function renderPager(info: ReturnType<typeof pageInfo>): void {
  const host = byId("runs-pager");
  host.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "pager-summary";
  summary.textContent =
    info.total === 0
      ? "Showing 0 of 0 selected"
      : `Showing ${info.start}-${info.end} of ${info.total} selected`;

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

function resetView(): void {
  state.selectedBucketRange = null;
  state.search = "";
  state.siteSearch = "";
  input("search-filter").value = "";
  input("site-search-filter").value = "";
  state.sorting = [{ id: "createdAtMs", desc: true }];
  state.siteSorting = [
    { id: "runCount", desc: true },
    { id: "latestRunAtMs", desc: true },
  ];
  state.pageIndex = 0;
  state.sitePageIndex = 0;
  selectAllActiveSitesInCurrentView();
  render();
}

function selectAllActiveSitesInCurrentView(): void {
  const fullRange = visibleRange(state.lookback);
  const activeRange = selectedBucketTimeRange(fullRange, state.selectedBucketRange);
  selectAllSitesInRange(activeRange);
}

function selectAllSitesInRange(range: ReturnType<typeof visibleRange>): void {
  const activeRows = rowsInTimeRange(state.rows, range);
  state.selectedSiteIds = new Set(buildSiteRows(state.sites, activeRows).map((site) => site.siteId));
}

function appendSortHeader<T>(th: HTMLTableCellElement, header: Header<T, unknown>): void {
  const label = document.createElement("span");
  const sortState = header.column.getIsSorted();
  label.className = "sort-label";
  label.textContent = String(header.column.columnDef.header ?? header.id);

  const indicator = document.createElement("span");
  indicator.className = `sort-indicator ${sortState ? "active" : ""}`;
  indicator.textContent = sortState === "asc" ? "↑" : sortState === "desc" ? "↓" : "↕";
  indicator.setAttribute("aria-hidden", "true");

  th.append(label, indicator);
  th.setAttribute(
    "aria-sort",
    sortState === "asc" ? "ascending" : sortState === "desc" ? "descending" : "none",
  );
  th.title =
    sortState === "asc"
      ? "Sorted ascending. Click to sort descending."
      : sortState === "desc"
        ? "Sorted descending. Click to clear sorting."
        : "Not sorted. Click to sort ascending.";
}

function filteredRows(rows: RunTableRow[]): RunTableRow[] {
  return rows.filter((row) => matchesRunSearch(row, state.search));
}

function filteredSiteRows(rows: SiteTableRow[]): SiteTableRow[] {
  return rows.filter((row) => matchesSiteSearch(row, state.siteSearch));
}

function visibleSelectedSiteIds(rows: SiteTableRow[]): Set<string> {
  const visibleIds = new Set(rows.map((row) => row.siteId));
  return new Set([...state.selectedSiteIds].filter((siteId) => visibleIds.has(siteId)));
}

function selectCell(siteId: string, selected: boolean): HTMLTableCellElement {
  const td = document.createElement("td");
  td.className = "select-column";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selected;
  checkbox.setAttribute("aria-label", `Select Site ${siteId}`);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) state.selectedSiteIds.add(siteId);
    else state.selectedSiteIds.delete(siteId);
    state.pageIndex = 0;
    render();
  });
  td.append(checkbox);
  return td;
}

function selectAllCell(rows: SiteTableRow[]): HTMLInputElement {
  const checkbox = document.createElement("input");
  const allSelected =
    rows.length > 0 && rows.every((row) => state.selectedSiteIds.has(row.siteId));
  const someSelected = rows.some((row) => state.selectedSiteIds.has(row.siteId));
  checkbox.type = "checkbox";
  checkbox.checked = allSelected;
  checkbox.indeterminate = someSelected && !allSelected;
  checkbox.disabled = rows.length === 0;
  checkbox.setAttribute("aria-label", "Select all visible Sites");
  checkbox.addEventListener("change", () => {
    if (allSelected) {
      for (const row of rows) state.selectedSiteIds.delete(row.siteId);
    } else {
      for (const row of rows) state.selectedSiteIds.add(row.siteId);
    }
    state.pageIndex = 0;
    render();
  });
  return checkbox;
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

function urlCell(url: string): HTMLTableCellElement {
  const td = document.createElement("td");
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = formatUrl(url);
  anchor.title = url;
  td.append(anchor);
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

function formatUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.host}${url.pathname}`;
  } catch {
    return value;
  }
}

function currentWindowLabel(): string {
  if (state.lookback === "1h") return "hour";
  if (state.lookback === "1d") return "day";
  if (state.lookback === "7d") return "week";
  return "month";
}

function activeWindowLabel(range: ReturnType<typeof visibleRange>): string {
  if (state.selectedBucketRange === null) return `last ${currentWindowLabel()}`;
  return formatActiveRange(range);
}

function formatActiveRange(range: ReturnType<typeof visibleRange>): string {
  const options: Intl.DateTimeFormatOptions =
    range.labelUnit === "hour"
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", hour: "numeric" };
  return `${new Date(range.startMs).toLocaleString([], options)}-${new Date(
    range.endMs,
  ).toLocaleString([], options)}`;
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
