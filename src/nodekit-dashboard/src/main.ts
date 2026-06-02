import type { Header, SortingState } from "@tanstack/table-core";

import { fetchDashboardData, fetchHealth, refreshDashboard } from "./api";
import { buildRunRows } from "./derive";
import {
  formatDateTimeWithZone,
  formatMinuteTimeAgo,
  formatTimeAgo,
  localTimeZoneLabel,
} from "./format";
import { healthClass, healthLabel } from "./health";
import { icon } from "./icons";
import {
  buildMatrixModel,
  defaultMatrixSelection,
  MATRIX_ROW_LIMIT,
  renderMasterMatrix,
  rowsInMatrixSelection,
  siteRowsInMatrixSelection,
  type MatrixController,
  type MatrixSelection,
} from "./matrix";
import { pageInfo, pageRows, rowsInTimeRange, SITES_PAGE_SIZE } from "./pagination";
import { matchesRunSearch, matchesSiteSearch } from "./search";
import "./styles.css";
import { createRunsTable, createSitesTable } from "./table";
import { lookbackRanges, visibleRange } from "./time-buckets";
import type {
  CachedRunItem,
  CachedSiteItem,
  CacheStatus,
  HealthStatus,
  LookbackRange,
  Platform,
  RunDashboardFilters,
  RunStatus,
  RunTableRow,
  SiteTableRow,
  TimeBounds,
} from "./types";

const HEALTH_POLL_INTERVAL_MS = 30_000;
const WINDOW_CLOCK_INTERVAL_MS = 60_000;

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
  runPlatformFilter: Platform | "";
  runStudyFilter: string;
  runParticipantFilter: string;
  runSessionFilter: string;
  pageIndex: number;
  sitePageIndex: number;
  selectedSiteIds: Set<string>;
  selectedTimeBounds: TimeBounds;
  matrixRowOffset: number;
  selectionFollowsGlobalWindow: boolean;
  hasInitializedMatrixSelection: boolean;
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
  runPlatformFilter: "",
  runStudyFilter: "",
  runParticipantFilter: "",
  runSessionFilter: "",
  pageIndex: 0,
  sitePageIndex: 0,
  selectedSiteIds: new Set(),
  selectedTimeBounds: visibleRange("1h"),
  matrixRowOffset: 0,
  selectionFollowsGlobalWindow: true,
  hasInitializedMatrixSelection: false,
  error: null,
  loading: false,
};

let matrixController: MatrixController | null = null;
let lastMatrixWidth = 0;
let matrixInteractionEpoch = 0;

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
          <h2>Site Activity <span id="matrix-title-meta" class="title-meta"></span></h2>
          <div id="range-pills" class="range-pills" aria-label="Histogram range"></div>
        </div>
        <div id="matrix" class="matrix-wrap"></div>
        <div id="matrix-scrub" class="matrix-scrub"></div>
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
        <div class="run-filters" aria-label="Run recruitment filters">
          <label class="filter-field">
            <span>Platform</span>
            <select id="run-platform-filter" aria-label="Filter Runs by recruitment platform">
              <option value="">All</option>
              <option value="NoPlatform">NoPlatform</option>
              <option value="Prolific">Prolific</option>
              <option value="MechanicalTurk">MechanicalTurk</option>
              <option value="MechanicalTurkSandbox">MechanicalTurkSandbox</option>
            </select>
          </label>
          <label class="filter-field">
            <span>Study/HIT</span>
            <input
              id="run-study-filter"
              type="text"
              placeholder="study-1, hit-1"
              aria-label="Filter Runs by Study or HIT IDs"
            />
          </label>
          <label class="filter-field">
            <span>Participant</span>
            <input
              id="run-participant-filter"
              type="text"
              placeholder="pid-1, worker-1"
              aria-label="Filter Runs by participant or worker IDs"
            />
          </label>
          <label class="filter-field">
            <span>Session</span>
            <input
              id="run-session-filter"
              type="text"
              placeholder="session-1, assignment-1"
              aria-label="Filter Runs by session or assignment IDs"
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
window.setInterval(() => render(), WINDOW_CLOCK_INTERVAL_MS);

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
    render();
  });
  select("run-platform-filter").addEventListener("change", (event) => {
    state.runPlatformFilter = (event.target as HTMLSelectElement).value as Platform | "";
    resetRunViewAfterFilterChange();
    void loadData();
  });
  input("run-study-filter").addEventListener("input", (event) => {
    state.runStudyFilter = (event.target as HTMLInputElement).value;
    resetRunViewAfterFilterChange();
    void loadData();
  });
  input("run-participant-filter").addEventListener("input", (event) => {
    state.runParticipantFilter = (event.target as HTMLInputElement).value;
    resetRunViewAfterFilterChange();
    void loadData();
  });
  input("run-session-filter").addEventListener("input", (event) => {
    state.runSessionFilter = (event.target as HTMLInputElement).value;
    resetRunViewAfterFilterChange();
    void loadData();
  });
}

function bindChartResize(): void {
  const host = byId("matrix");
  if (!("ResizeObserver" in window)) return;
  const observer = new ResizeObserver(() => {
    const width = Math.round(host.clientWidth);
    if (width <= 0 || width === lastMatrixWidth) return;
    lastMatrixWidth = width;
    render();
  });
  observer.observe(host);
}

async function loadData(): Promise<void> {
  state.loading = true;
  state.error = null;
  const range = visibleRange(state.lookback);
  try {
    const data = await fetchDashboardData(range, currentRunFilters());
    state.status = data.status;
    state.runs = data.runs.filter((run) => !run.is_archived);
    state.sites = data.sites;
    state.rows = buildRunRows(state.runs, state.sites);
    const matrix = buildCurrentMatrix();
    if (!state.hasInitializedMatrixSelection || state.selectionFollowsGlobalWindow) {
      setMatrixSelection(defaultMatrixSelection(matrix.model, matrix.range), true);
    } else {
      const currentSiteIds = new Set(matrix.model.allRows.map((row) => row.site.siteId));
      state.selectedSiteIds = new Set(
        [...state.selectedSiteIds].filter((siteId) => currentSiteIds.has(siteId)),
      );
    }
    state.hasInitializedMatrixSelection = true;
    state.pageIndex = 0;
    state.sitePageIndex = 0;
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
  const { range, windowRows, model } = buildCurrentMatrix();
  state.matrixRowOffset = model.rowOffset;
  if (state.selectionFollowsGlobalWindow) {
    setMatrixSelection(defaultMatrixSelection(model, range), true);
  }
  const selection = currentMatrixSelection();
  const selectedRunRows = rowsInMatrixSelection(windowRows, selection);
  const selectedSiteRows = siteRowsInMatrixSelection(state.sites, selection, selectedRunRows);
  const visibleSiteRows = filteredSiteRows(selectedSiteRows);
  const visibleRunRows = filteredRows(selectedRunRows);
  renderTopbar();
  renderTitleMetadata(selectedRunRows.length, selectedSiteRows.length);
  renderRangePills();
  renderMatrix(model, range, selection);
  renderMatrixScrub(model);
  renderSitesTable(visibleSiteRows, selectedSiteRows.length);
  renderRunsTable(visibleRunRows);
  byId("error").textContent = state.error ?? "";
}

function renderTitleMetadata(
  runCount: number,
  siteCount: number,
): void {
  const label = `last ${currentWindowLabel()}`;
  byId("matrix-title-meta").textContent = `(n=${runCount} Runs · ${siteCount} Sites selected)`;
  byId("sites-title-meta").textContent = `(n=${siteCount} in selection)`;
  byId("runs-title-meta").textContent = `(n=${runCount} in selection, ${label})`;
}

function renderTopbar(): void {
  byId("brand-meta").textContent = state.status?.source_api_url
    ? `Source: ${state.status.source_api_url}`
    : "Cache-only shell";
  const healthLight = byId("health-light");
  healthLight.className = healthClass(state.health);
  healthLight.title = healthLabel(state.health);
  healthLight.setAttribute("aria-label", healthLabel(state.health));
  const cacheLine = byId("cache-line");
  if (state.status?.last_refresh_at) {
    cacheLine.textContent = `Last refreshed ${formatTimeAgo(state.status.last_refresh_at)}`;
    cacheLine.title = formatDateTimeWithZone(state.status.last_refresh_at);
  } else {
    cacheLine.textContent = `No refresh recorded (${localTimeZoneLabel()})`;
    cacheLine.removeAttribute("title");
  }
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

function renderMatrix(
  model: ReturnType<typeof buildMatrixModel>,
  range: ReturnType<typeof visibleRange>,
  selection: MatrixSelection,
): void {
  const epoch = ++matrixInteractionEpoch;
  matrixController?.destroy();
  matrixController = renderMasterMatrix(byId("matrix"), model, range, {
    selection,
    observedThroughMs: observedThroughMs(),
    onSelect(nextSelection) {
      if (epoch !== matrixInteractionEpoch) return;
      setMatrixSelection(nextSelection, false);
      state.pageIndex = 0;
      state.sitePageIndex = 0;
      render();
    },
  });
  lastMatrixWidth = Math.round(byId("matrix").clientWidth);
}

function changeLookback(range: LookbackRange): void {
  matrixInteractionEpoch += 1;
  state.lookback = range;
  state.matrixRowOffset = 0;
  state.pageIndex = 0;
  state.sitePageIndex = 0;
  void loadData();
}

function renderMatrixScrub(model: ReturnType<typeof buildMatrixModel>): void {
  const host = byId("matrix-scrub");
  host.replaceChildren();
  if (model.totalRows <= MATRIX_ROW_LIMIT) return;

  const label = document.createElement("span");
  label.className = "matrix-scrub-label";
  label.textContent = `Sites ${model.rowOffset + 1}-${Math.min(
    model.rowOffset + MATRIX_ROW_LIMIT,
    model.totalRows,
  )} of ${model.totalRows}`;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = String(Math.max(0, model.totalRows - MATRIX_ROW_LIMIT));
  slider.step = "1";
  slider.value = String(model.rowOffset);
  slider.setAttribute("aria-label", "Scrub visible Site rows");
  slider.addEventListener("input", () => {
    state.matrixRowOffset = Number(slider.value);
    render();
  });

  host.append(label, slider);
}

function renderSitesTable(rows: SiteTableRow[], selectedCount: number): void {
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
  html.className = "sites-table";
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
      textCell(shortId(source.siteId), source.siteId),
      textCell(source.tags.join(", ") || "none", source.tags.join(", ")),
      textCell(String(source.runCount)),
      textCell(formatOptionalDateTime(source.latestRunAt)),
      textCell(formatRelativeTimestamp(source.createdAt), formatDateTimeWithZone(source.createdAt)),
      textCell(formatDateTimeWithZone(source.createdAt)),
      urlCell(source.url),
    );
    tbody.append(tr);
  }
  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = textCell("No Sites match this table view.");
    td.colSpan = 7;
    tr.append(td);
    tbody.append(tr);
  }
  html.append(thead, tbody);
  byId("sites-table").replaceChildren(html);
  renderSitesPager(info, selectedCount);
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
  html.className = "runs-table";
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
      textCell(source.tags.join(", ") || "none", source.tags.join(", ")),
      textCell(source.platformLabel, source.platformLabel),
      textCell(shortNullableId(source.recruiterStudyId), source.recruiterStudyId ?? undefined),
      textCell(
        shortNullableId(source.recruiterParticipantId),
        source.recruiterParticipantId ?? undefined,
      ),
      textCell(shortNullableId(source.recruiterSessionId), source.recruiterSessionId ?? undefined),
      textCell(formatRelativeTimestamp(source.createdAt), formatDateTimeWithZone(source.createdAt)),
      textCell(formatDateTimeWithZone(source.createdAt)),
      textCell(formatDuration(source.durationMsec)),
      textCell(source.eventCount === null ? "" : String(source.eventCount)),
    );
    tbody.append(tr);
  }
  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = textCell("No cached Runs match this view.");
    td.colSpan = 12;
    tr.append(td);
    tbody.append(tr);
  }
  html.append(thead, tbody);
  byId("runs-table").replaceChildren(html);
  renderPager(info);
}

function renderSitesPager(info: ReturnType<typeof pageInfo>, selectedCount: number): void {
  const host = byId("sites-pager");
  host.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "pager-summary";
  summary.textContent =
    info.total === 0
      ? "Showing 0 of 0 in selection"
      : `Showing ${info.start}-${info.end} of ${info.total} in selection`;

  const controls = document.createElement("div");
  controls.className = "pager-controls";
  const selected = document.createElement("span");
  selected.className = "pager-page";
  selected.textContent = `${selectedCount} Sites selected`;
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
  state.search = "";
  state.siteSearch = "";
  state.runPlatformFilter = "";
  state.runStudyFilter = "";
  state.runParticipantFilter = "";
  state.runSessionFilter = "";
  input("search-filter").value = "";
  input("site-search-filter").value = "";
  select("run-platform-filter").value = "";
  input("run-study-filter").value = "";
  input("run-participant-filter").value = "";
  input("run-session-filter").value = "";
  state.sorting = [{ id: "createdAtMs", desc: true }];
  state.siteSorting = [
    { id: "runCount", desc: true },
    { id: "latestRunAtMs", desc: true },
  ];
  state.pageIndex = 0;
  state.sitePageIndex = 0;
  state.matrixRowOffset = 0;
  state.hasInitializedMatrixSelection = false;
  state.selectionFollowsGlobalWindow = true;
  void loadData();
}

function resetRunViewAfterFilterChange(): void {
  state.pageIndex = 0;
  state.sitePageIndex = 0;
  state.matrixRowOffset = 0;
  state.hasInitializedMatrixSelection = false;
}

function currentRunFilters(): RunDashboardFilters {
  return {
    recruitmentPlatforms: state.runPlatformFilter ? [state.runPlatformFilter] : [],
    recruiterStudyIds: splitFilterValues(state.runStudyFilter),
    recruiterParticipantIds: splitFilterValues(state.runParticipantFilter),
    recruiterSessionIds: splitFilterValues(state.runSessionFilter),
  };
}

function splitFilterValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function buildCurrentMatrix(): {
  range: ReturnType<typeof visibleRange>;
  windowRows: RunTableRow[];
  model: ReturnType<typeof buildMatrixModel>;
} {
  const range = visibleRange(state.lookback);
  const windowRows = rowsInTimeRange(state.rows, range);
  return {
    range,
    windowRows,
    model: buildMatrixModel(
      state.sites,
      windowRows,
      range,
      MATRIX_ROW_LIMIT,
      state.matrixRowOffset,
    ),
  };
}

function currentMatrixSelection(): MatrixSelection {
  return {
    siteIds: new Set(state.selectedSiteIds),
    timeBounds: state.selectedTimeBounds,
  };
}

function observedThroughMs(): number | null {
  if (!state.status?.last_refresh_at) return null;
  const parsed = Date.parse(state.status.last_refresh_at);
  return Number.isFinite(parsed) ? parsed : null;
}

function setMatrixSelection(selection: MatrixSelection, followsGlobalWindow: boolean): void {
  state.selectedSiteIds = new Set(selection.siteIds);
  state.selectedTimeBounds = selection.timeBounds;
  state.selectionFollowsGlobalWindow = followsGlobalWindow;
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

function formatOptionalDateTime(value: string): string {
  if (!value) return "";
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTimestamp(value: string): string {
  if (!value) return "";
  return formatMinuteTimeAgo(value);
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

function shortNullableId(value: string | null): string {
  return value === null ? "" : shortId(value);
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

function select(id: string): HTMLSelectElement {
  return byId(id) as HTMLSelectElement;
}
