import { buildSiteRows } from "./derive";
import type { CachedSiteItem, RunTableRow, SiteTableRow, TimeBounds, TimeRange } from "./types";

export const MATRIX_ROW_LIMIT = 50;
const COLOR_SCALE_CAP = 1000;

export interface MatrixBin extends TimeBounds {
  index: number;
}

export interface MatrixRow {
  site: SiteTableRow;
  counts: number[];
  runsByBin: RunTableRow[][];
}

export interface MatrixModel {
  bins: MatrixBin[];
  allRows: MatrixRow[];
  rows: MatrixRow[];
  aggregateCounts: number[];
  maxCount: number;
  rowOffset: number;
  totalRows: number;
}

export interface MatrixSelection {
  siteIds: Set<string>;
  timeBounds: TimeBounds;
}

export interface MatrixController {
  destroy(): void;
}

export interface MatrixInteraction {
  selection: MatrixSelection;
  observedThroughMs: number | null;
  onSelect(selection: MatrixSelection): void;
}

interface MatrixEndpoint {
  rowIndex: number | null;
  binIndex: number | null;
  type: "aggregate" | "all" | "cell" | "row";
}

interface MatrixElements {
  cell: HTMLElement;
  rowIndex: number;
  binIndex: number;
}

interface RowLabelElement {
  element: HTMLElement;
  rowIndex: number;
}

interface AggregateElement {
  cell: HTMLElement;
  binIndex: number;
}

interface SelectionGridBounds {
  rowStart: number;
  rowEnd: number;
  binStart: number;
  binEnd: number;
}

type ObservationState = "observed" | "partial" | "unknown";

export function buildMatrixBins(range: TimeRange): MatrixBin[] {
  const bins: MatrixBin[] = [];
  for (let startMs = range.startMs; startMs < range.endMs; startMs += range.bucketMs) {
    bins.push({
      index: bins.length,
      startMs,
      endMs: Math.min(range.endMs, startMs + range.bucketMs),
    });
  }
  return bins;
}

export function buildMatrixModel(
  sites: CachedSiteItem[],
  rows: RunTableRow[],
  range: TimeRange,
  rowLimit = MATRIX_ROW_LIMIT,
  rowOffset = 0,
): MatrixModel {
  const bins = buildMatrixBins(range);
  const allSiteRows = buildMatrixSiteRows(sites, rows, range);
  const safeOffset = clampRowOffset(rowOffset, allSiteRows.length, rowLimit);
  const allRows: MatrixRow[] = allSiteRows.map((site) => ({
    site,
    counts: Array.from({ length: bins.length }, () => 0),
    runsByBin: Array.from({ length: bins.length }, () => []),
  }));
  const rowBySiteId = new Map(allRows.map((row, index) => [row.site.siteId, { row, index }]));

  for (const run of rows) {
    const entry = rowBySiteId.get(run.siteId);
    if (!entry) continue;
    const binIndex = binIndexForTimestamp(bins, run.createdAtMs);
    if (binIndex === null) continue;
    entry.row.counts[binIndex] += 1;
    entry.row.runsByBin[binIndex]!.push(run);
  }

  const matrixRows = allRows.slice(safeOffset, safeOffset + rowLimit);
  const aggregateCounts = bins.map((_bin, binIndex) =>
    allRows.reduce((sum, row) => sum + row.counts[binIndex]!, 0),
  );
  const maxCount = Math.max(1, ...aggregateCounts, ...allRows.flatMap((row) => row.counts));
  return {
    bins,
    allRows,
    rows: matrixRows,
    aggregateCounts,
    maxCount,
    rowOffset: safeOffset,
    totalRows: allSiteRows.length,
  };
}

export function defaultMatrixSelection(model: MatrixModel, range: TimeRange): MatrixSelection {
  return {
    siteIds: new Set(model.allRows.map((row) => row.site.siteId)),
    timeBounds: { startMs: range.startMs, endMs: range.endMs },
  };
}

export function rowsInMatrixSelection(
  rows: RunTableRow[],
  selection: MatrixSelection,
): RunTableRow[] {
  return rows.filter(
    (row) =>
      selection.siteIds.has(row.siteId) &&
      row.createdAtMs >= selection.timeBounds.startMs &&
      row.createdAtMs <= selection.timeBounds.endMs,
  );
}

export function siteRowsInMatrixSelection(
  sites: CachedSiteItem[],
  selection: MatrixSelection,
  selectedRows: RunTableRow[],
): SiteTableRow[] {
  const stats = new Map<string, { runCount: number; latestRunAt: string; latestRunAtMs: number }>();
  for (const row of selectedRows) {
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
    .filter((site) => selection.siteIds.has(site.site_id))
    .map((site) => {
      const siteStats = stats.get(site.site_id);
      const createdAtMs = Date.parse(site.timestamp_created);
      return {
        siteId: site.site_id,
        tags: site.tags,
        url: site.url,
        createdAt: site.timestamp_created,
        createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : 0,
        runCount: siteStats?.runCount ?? 0,
        latestRunAt: siteStats?.latestRunAt ?? "",
        latestRunAtMs: siteStats?.latestRunAtMs ?? 0,
        source: site,
      };
    })
    .sort((a, b) => b.runCount - a.runCount || b.latestRunAtMs - a.latestRunAtMs);
}

export function selectionFromCell(
  model: MatrixModel,
  rowIndex: number,
  binIndex: number,
): MatrixSelection {
  const row = model.rows[rowIndex];
  const bin = model.bins[binIndex];
  if (!row || !bin) return emptySelection();
  return { siteIds: new Set([row.site.siteId]), timeBounds: bin };
}

export function selectionFromRow(model: MatrixModel, rowIndex: number, range: TimeRange): MatrixSelection {
  const row = model.rows[rowIndex];
  if (!row) return emptySelection();
  return {
    siteIds: new Set([row.site.siteId]),
    timeBounds: { startMs: range.startMs, endMs: range.endMs },
  };
}

export function selectionFromAggregateBin(
  model: MatrixModel,
  binIndex: number,
): MatrixSelection {
  const bin = model.bins[binIndex];
  if (!bin) return emptySelection();
  return {
    siteIds: new Set(model.allRows.map((row) => row.site.siteId)),
    timeBounds: bin,
  };
}

export function selectionFromAll(model: MatrixModel, range: TimeRange): MatrixSelection {
  return defaultMatrixSelection(model, range);
}

export function selectionFromDrag(
  model: MatrixModel,
  range: TimeRange,
  start: MatrixEndpoint,
  end: MatrixEndpoint,
): MatrixSelection {
  if (start.type === "all" || end.type === "all") {
    return selectionFromAll(model, range);
  }

  if (start.type === "row" && end.type === "row" && start.rowIndex !== null) {
    const rowIndices = rowIndexRange(start.rowIndex, end.rowIndex);
    return {
      siteIds: new Set(rowIndices.flatMap((index) => model.rows[index]?.site.siteId ?? [])),
      timeBounds: { startMs: range.startMs, endMs: range.endMs },
    };
  }

  const startBin = start.binIndex;
  const endBin = end.binIndex;
  if (startBin === null || endBin === null) return emptySelection();
  const binStart = Math.min(startBin, endBin);
  const binEnd = Math.max(startBin, endBin);
  const startBucket = model.bins[binStart];
  const endBucket = model.bins[binEnd];
  if (!startBucket || !endBucket) return emptySelection();

  if (start.type === "aggregate" || end.type === "aggregate") {
    return {
      siteIds: new Set(model.allRows.map((row) => row.site.siteId)),
      timeBounds: { startMs: startBucket.startMs, endMs: endBucket.endMs },
    };
  }

  return {
    siteIds: new Set(
      rowIndexRange(start.rowIndex, end.rowIndex).flatMap(
        (index) => model.rows[index]?.site.siteId ?? [],
      ),
    ),
    timeBounds: { startMs: startBucket.startMs, endMs: endBucket.endMs },
  };
}

export function renderMasterMatrix(
  parent: HTMLElement,
  model: MatrixModel,
  range: TimeRange,
  interaction: MatrixInteraction,
): MatrixController {
  parent.replaceChildren();
  if (model.rows.length === 0 || model.bins.length === 0) {
    const empty = document.createElement("div");
    empty.className = "matrix-empty";
    empty.textContent = "No cached Sites have Runs in this window";
    parent.append(empty);
    return { destroy() {} };
  }

  const host = document.createElement("div");
  host.className = "matrix-host";
  const grid = document.createElement("div");
  grid.className = "master-matrix";
  grid.style.setProperty("--matrix-columns", String(model.bins.length));

  const readout = document.createElement("div");
  readout.className = "matrix-readout";
  readout.textContent = selectionReadout(model, interaction.selection);

  const cells: MatrixElements[] = [];
  const rowLabels: RowLabelElement[] = [];
  const aggregateCells: AggregateElement[] = [];
  let pointerStart: MatrixEndpoint | null = null;
  let pointerMoved = false;

  grid.append(cornerCell(), ...timeHeaderCells(model, range));
  grid.append(
    labelCell("Total", "matrix-aggregate-label"),
    ...renderAggregateCells(model, range, aggregateCells, interaction.observedThroughMs),
  );
  for (const [rowIndex, row] of model.rows.entries()) {
    grid.append(rowLabel(row, rowIndex, range, rowLabels));
    for (const [binIndex, count] of row.counts.entries()) {
      const cell = matrixCell(
        row,
        rowIndex,
        binIndex,
        count,
        observationState(model.bins[binIndex]!, interaction.observedThroughMs),
      );
      cells.push({ cell, rowIndex, binIndex });
      grid.append(cell);
    }
  }

  const selectionOverlay = selectionOverlayElement("matrix-selection-overlay");
  const previewOverlay = selectionOverlayElement("matrix-selection-overlay matrix-preview-overlay");
  grid.append(selectionOverlay, previewOverlay);

  host.append(grid);
  parent.append(host, readout);
  applySelectionState({
    cells,
    rowLabels,
    aggregateCells,
    model,
    selection: interaction.selection,
    selectionOverlay,
  });
  hideOverlay(previewOverlay);

  grid.addEventListener("pointerdown", (event) => {
    const endpoint = endpointFromEvent(event);
    if (!endpoint) return;
    pointerStart = endpoint;
    pointerMoved = false;
    grid.setPointerCapture(event.pointerId);
  });

  grid.addEventListener("pointermove", (event) => {
    const endpoint = endpointFromEvent(event);
    if (!endpoint) return;
    const hover = selectionFromEndpoint(model, range, endpoint);
    readout.textContent = endpointReadout(
      model,
      range,
      endpoint,
      hover,
      interaction.observedThroughMs,
    );
    if (!pointerStart) return;
    pointerMoved = true;
    renderSelectionOverlay(previewOverlay, model, cells, selectionFromDrag(model, range, pointerStart, endpoint));
  });

  grid.addEventListener("pointerleave", () => {
    if (pointerStart) return;
    readout.textContent = selectionReadout(model, interaction.selection);
  });

  grid.addEventListener("pointerup", (event) => {
    const endpoint = endpointFromEvent(event);
    if (pointerStart && endpoint) {
      const selection = pointerMoved
        ? selectionFromDrag(model, range, pointerStart, endpoint)
        : selectionFromEndpoint(model, range, endpoint);
      interaction.onSelect(selection);
    }
    pointerStart = null;
    pointerMoved = false;
    hideOverlay(previewOverlay);
    grid.releasePointerCapture(event.pointerId);
  });

  grid.addEventListener("pointercancel", (event) => {
    pointerStart = null;
    pointerMoved = false;
    hideOverlay(previewOverlay);
    readout.textContent = selectionReadout(model, interaction.selection);
    grid.releasePointerCapture(event.pointerId);
  });

  return {
    destroy() {
      parent.replaceChildren();
    },
  };
}

function binIndexForTimestamp(bins: MatrixBin[], timestampMs: number): number | null {
  if (bins.length === 0) return null;
  const first = bins[0]!;
  const last = bins[bins.length - 1]!;
  if (timestampMs < first.startMs || timestampMs > last.endMs) return null;
  const index = Math.min(
    bins.length - 1,
    Math.floor((timestampMs - first.startMs) / Math.max(1, first.endMs - first.startMs)),
  );
  return index;
}

function buildMatrixSiteRows(
  sites: CachedSiteItem[],
  rows: RunTableRow[],
  range: TimeRange,
): SiteTableRow[] {
  const activeRows = buildSiteRows(sites, rows);
  const activeBySiteId = new Map(activeRows.map((row) => [row.siteId, row]));
  const createdRows = sites.flatMap((site) => {
    if (activeBySiteId.has(site.site_id)) return [];
    const createdAtMs = Date.parse(site.timestamp_created);
    if (!Number.isFinite(createdAtMs)) return [];
    if (createdAtMs < range.startMs || createdAtMs > range.endMs) return [];
    return [
      {
        siteId: site.site_id,
        tags: site.tags,
        url: site.url,
        createdAt: site.timestamp_created,
        createdAtMs,
        runCount: 0,
        latestRunAt: "",
        latestRunAtMs: 0,
        source: site,
      },
    ];
  });

  return [...activeRows, ...createdRows].sort(
    (a, b) =>
      b.runCount - a.runCount ||
      b.latestRunAtMs - a.latestRunAtMs ||
      b.createdAtMs - a.createdAtMs,
  );
}

function clampRowOffset(offset: number, totalRows: number, rowLimit: number): number {
  const maxOffset = Math.max(0, totalRows - rowLimit);
  return Math.max(0, Math.min(Math.floor(offset), maxOffset));
}

function emptySelection(): MatrixSelection {
  return { siteIds: new Set(), timeBounds: { startMs: 0, endMs: 0 } };
}

function rowIndexRange(start: number | null, end: number | null): number[] {
  if (start === null || end === null) return [];
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  return Array.from({ length: high - low + 1 }, (_value, offset) => low + offset);
}

function cornerCell(): HTMLElement {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "matrix-corner";
  cell.textContent = "All";
  cell.title = "Select all Sites in the full time window";
  return cell;
}

function timeHeaderCells(model: MatrixModel, range: TimeRange): HTMLElement[] {
  return model.bins.map((bin) => {
    const cell = document.createElement("div");
    const label = timeHeaderLabel(bin, range);
    cell.className = "matrix-time-label";
    if (label) cell.classList.add("has-label");
    cell.textContent = label;
    cell.title = formatInterval(bin.startMs, bin.endMs, range);
    return cell;
  });
}

function renderAggregateCells(
  model: MatrixModel,
  range: TimeRange,
  aggregateCells: AggregateElement[],
  observedThroughMs: number | null,
): HTMLElement[] {
  return model.aggregateCounts.map((count, binIndex) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "matrix-cell matrix-aggregate-cell";
    cell.dataset.rowIndex = "-1";
    cell.dataset.binIndex = String(binIndex);
    applyCellColor(cell, count, observationState(model.bins[binIndex]!, observedThroughMs));
    cell.title = `All Sites · ${formatInterval(
      model.bins[binIndex]!.startMs,
      model.bins[binIndex]!.endMs,
      range,
    )} · ${count} Runs`;
    aggregateCells.push({ cell, binIndex });
    return cell;
  });
}

function rowLabel(
  row: MatrixRow,
  rowIndex: number,
  range: TimeRange,
  rowLabels: RowLabelElement[],
): HTMLElement {
  const label = document.createElement("button");
  label.type = "button";
  label.className = "matrix-row-label";
  label.dataset.rowIndex = String(rowIndex);
  label.textContent = shortId(row.site.siteId);
  label.title = [
    row.site.siteId,
    row.site.tags.join(", ") || "no tags",
    row.site.url,
    `full window: ${formatInterval(range.startMs, range.endMs, range)}`,
  ].join("\n");
  rowLabels.push({ element: label, rowIndex });
  return label;
}

function labelCell(text: string, className: string): HTMLElement {
  const cell = document.createElement("div");
  cell.className = className;
  cell.textContent = text;
  return cell;
}

function matrixCell(
  row: MatrixRow,
  rowIndex: number,
  binIndex: number,
  count: number,
  state: ObservationState,
): HTMLElement {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "matrix-cell";
  cell.dataset.rowIndex = String(rowIndex);
  cell.dataset.binIndex = String(binIndex);
  applyCellColor(cell, count, state);
  cell.title = `${row.site.siteId} · ${count} Runs`;
  return cell;
}

function endpointFromEvent(event: PointerEvent): MatrixEndpoint | null {
  const element = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest<HTMLElement>(".matrix-cell, .matrix-row-label, .matrix-corner");
  if (!element) return null;
  if (element.classList.contains("matrix-corner")) {
    return { type: "all", rowIndex: null, binIndex: null };
  }
  if (element.classList.contains("matrix-row-label")) {
    return { type: "row", rowIndex: numberData(element, "rowIndex"), binIndex: null };
  }
  const rowIndex = numberData(element, "rowIndex");
  const binIndex = numberData(element, "binIndex");
  return {
    type: rowIndex === -1 ? "aggregate" : "cell",
    rowIndex,
    binIndex,
  };
}

function selectionFromEndpoint(
  model: MatrixModel,
  range: TimeRange,
  endpoint: MatrixEndpoint,
): MatrixSelection {
  if (endpoint.type === "row" && endpoint.rowIndex !== null) {
    return selectionFromRow(model, endpoint.rowIndex, range);
  }
  if (endpoint.type === "all") {
    return selectionFromAll(model, range);
  }
  if (endpoint.type === "aggregate" && endpoint.binIndex !== null) {
    return selectionFromAggregateBin(model, endpoint.binIndex);
  }
  if (endpoint.rowIndex !== null && endpoint.binIndex !== null) {
    return selectionFromCell(model, endpoint.rowIndex, endpoint.binIndex);
  }
  return emptySelection();
}

function applySelectionState(options: {
  cells: MatrixElements[];
  rowLabels: RowLabelElement[];
  aggregateCells: AggregateElement[];
  model: MatrixModel;
  selection: MatrixSelection;
  selectionOverlay: HTMLElement;
}): void {
  const { cells, rowLabels, aggregateCells, model, selection, selectionOverlay } = options;
  for (const { cell, rowIndex, binIndex } of cells) {
    const siteId = model.rows[rowIndex]?.site.siteId;
    const selected = siteId ? cellInSelection(siteId, rowIndex, binIndex, selection, model) : false;
    cell.classList.toggle("dimmed", !selected);
  }
  for (const { element, rowIndex } of rowLabels) {
    const siteId = model.rows[rowIndex]?.site.siteId;
    element.classList.toggle("dimmed", siteId ? !selection.siteIds.has(siteId) : true);
  }
  for (const { cell, binIndex } of aggregateCells) {
    const bin = model.bins[binIndex];
    const selected = bin
      ? bin.endMs > selection.timeBounds.startMs && bin.startMs < selection.timeBounds.endMs
      : false;
    cell.classList.toggle("dimmed", !selected);
  }
  renderSelectionOverlay(selectionOverlay, model, cells, selection);
}

function cellInSelection(
  siteId: string,
  _rowIndex: number,
  binIndex: number,
  selection: MatrixSelection,
  model: MatrixModel,
): boolean {
  const bin = model.bins[binIndex];
  if (!bin) return false;
  return (
    selection.siteIds.has(siteId) &&
    bin.endMs > selection.timeBounds.startMs &&
    bin.startMs < selection.timeBounds.endMs
  );
}

function endpointReadout(
  model: MatrixModel,
  range: TimeRange,
  endpoint: MatrixEndpoint,
  selection: MatrixSelection,
  observedThroughMs: number | null,
): string {
  if (endpoint.type === "row" && endpoint.rowIndex !== null) {
    const row = model.rows[endpoint.rowIndex];
    return row
      ? `${shortId(row.site.siteId)} · ${row.site.runCount} Runs in ${windowLabel(range)}`
      : selectionReadout(model, selection);
  }
  if (endpoint.type === "all") {
    return `All Sites · ${windowLabel(range)}`;
  }
  if (endpoint.type === "aggregate" && endpoint.binIndex !== null) {
    const bin = model.bins[endpoint.binIndex];
    const count = model.aggregateCounts[endpoint.binIndex] ?? 0;
    const state = bin ? observationState(bin, observedThroughMs) : "observed";
    if (state === "unknown") return bin ? `${formatInterval(bin.startMs, bin.endMs, range)} · not refreshed yet` : "";
    if (state === "partial") {
      return bin
        ? `All Sites · ${formatInterval(bin.startMs, bin.endMs, range)} · partially refreshed · ${count} Runs`
        : "";
    }
    return bin ? `All Sites · ${formatInterval(bin.startMs, bin.endMs, range)} · ${count} Runs` : "";
  }
  if (endpoint.rowIndex !== null && endpoint.binIndex !== null) {
    const row = model.rows[endpoint.rowIndex];
    const bin = model.bins[endpoint.binIndex];
    const count = row?.counts[endpoint.binIndex] ?? 0;
    const state = bin ? observationState(bin, observedThroughMs) : "observed";
    if (row && bin && state === "unknown") {
      return `${shortId(row.site.siteId)} · ${formatInterval(bin.startMs, bin.endMs, range)} · not refreshed yet`;
    }
    if (row && bin && state === "partial") {
      return `${shortId(row.site.siteId)} · ${formatInterval(bin.startMs, bin.endMs, range)} · partially refreshed · ${count} Runs`;
    }
    return row && bin
      ? `${shortId(row.site.siteId)} · ${formatInterval(bin.startMs, bin.endMs, range)} · ${count} Runs`
      : selectionReadout(model, selection);
  }
  return selectionReadout(model, selection);
}

function selectionReadout(model: MatrixModel, selection: MatrixSelection): string {
  const selectedRuns = model.allRows.reduce((total, row) => {
    if (!selection.siteIds.has(row.site.siteId)) return total;
    return total + row.runsByBin.reduce((sum, runs, index) => {
      const bin = model.bins[index]!;
      return bin.endMs > selection.timeBounds.startMs && bin.startMs < selection.timeBounds.endMs
        ? sum + runs.length
        : sum;
    }, 0);
  }, 0);
  return `${selection.siteIds.size} Sites · ${selectedRuns} Runs selected`;
}

function numberData(element: HTMLElement, key: string): number | null {
  const value = element.dataset[key];
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function applyCellColor(cell: HTMLElement, count: number, state: ObservationState): void {
  cell.style.setProperty("--cell-color", densityColor(count));
  cell.classList.toggle("is-empty", count <= 0);
  cell.classList.toggle("is-unknown", state === "unknown");
  cell.classList.toggle("is-partial-unknown", state === "partial");
}

export function densityColor(count: number): string {
  if (count <= 0) return "transparent";
  const normalized = Math.log1p(Math.min(count, COLOR_SCALE_CAP)) / Math.log1p(COLOR_SCALE_CAP);
  const lightness = 96 - normalized * 42;
  const chroma = 0.018 + normalized * 0.082;
  return `oklch(${lightness.toFixed(2)}% ${chroma.toFixed(4)} 165)`;
}

export function observationState(
  bin: TimeBounds,
  observedThroughMs: number | null,
): ObservationState {
  if (observedThroughMs === null || observedThroughMs >= bin.endMs) return "observed";
  if (observedThroughMs <= bin.startMs) return "unknown";
  return "partial";
}

function selectionOverlayElement(className: string): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = className;
  return overlay;
}

function renderSelectionOverlay(
  overlay: HTMLElement,
  model: MatrixModel,
  cells: MatrixElements[],
  selection: MatrixSelection,
): void {
  const bounds = selectionGridBounds(model, selection);
  if (!bounds) {
    hideOverlay(overlay);
    return;
  }
  const firstCell = matrixElement(cells, bounds.rowStart, bounds.binStart);
  const lastCell = matrixElement(cells, bounds.rowEnd, bounds.binEnd);
  if (!firstCell || !lastCell) {
    hideOverlay(overlay);
    return;
  }
  overlay.hidden = false;
  overlay.style.left = `${firstCell.offsetLeft}px`;
  overlay.style.top = `${firstCell.offsetTop}px`;
  overlay.style.width = `${lastCell.offsetLeft + lastCell.offsetWidth - firstCell.offsetLeft}px`;
  overlay.style.height = `${lastCell.offsetTop + lastCell.offsetHeight - firstCell.offsetTop}px`;
}

function hideOverlay(overlay: HTMLElement): void {
  overlay.hidden = true;
  overlay.style.left = "";
  overlay.style.top = "";
  overlay.style.width = "";
  overlay.style.height = "";
}

function selectionGridBounds(
  model: MatrixModel,
  selection: MatrixSelection,
): SelectionGridBounds | null {
  const rowIndices = model.rows.flatMap((row, index) =>
    selection.siteIds.has(row.site.siteId) ? [index] : [],
  );
  const binIndices = model.bins.flatMap((bin, index) =>
    bin.endMs > selection.timeBounds.startMs && bin.startMs < selection.timeBounds.endMs
      ? [index]
      : [],
  );
  if (rowIndices.length === 0 || binIndices.length === 0) return null;
  return {
    rowStart: Math.min(...rowIndices),
    rowEnd: Math.max(...rowIndices),
    binStart: Math.min(...binIndices),
    binEnd: Math.max(...binIndices),
  };
}

function matrixElement(
  cells: MatrixElements[],
  rowIndex: number,
  binIndex: number,
): HTMLElement | null {
  return (
    cells.find((entry) => entry.rowIndex === rowIndex && entry.binIndex === binIndex)?.cell ?? null
  );
}

export function timeHeaderLabel(bin: MatrixBin, range: TimeRange): string {
  if (bin.endMs === range.endMs) {
    return range.bucketMs === 60 * 1000 ? "now" : "today";
  }

  if (range.bucketMs === 60 * 1000) {
    if (bin.index === 0) return "1h";
    if (bin.index === 15) return "45m";
    if (bin.index === 30) return "30m";
    if (bin.index === 45) return "15m";
    return "";
  }

  if (range.bucketMs === 15 * 60 * 1000) {
    if (bin.index === 0) return "1d";
    if (bin.index === 24) return "18h";
    if (bin.index === 48) return "12h";
    if (bin.index === 72) return "6h";
    return "";
  }

  if (range.bucketMs === 60 * 60 * 1000) {
    if (bin.index % 24 === 0) return `${Math.max(1, 7 - bin.index / 24)}d`;
    return "";
  }

  if (bin.index % 6 === 0) return `${Math.max(1, 30 - bin.index)}d`;
  return "";
}

function formatInterval(startMs: number, endMs: number, range: TimeRange): string {
  const options: Intl.DateTimeFormatOptions =
    range.labelUnit === "hour"
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", hour: "numeric" };
  return `${new Date(startMs).toLocaleString([], options)} - ${new Date(endMs).toLocaleString([], options)}`;
}

function windowLabel(range: TimeRange): string {
  const durationMs = range.endMs - range.startMs;
  if (durationMs <= 90 * 60 * 1000) return "the current hour";
  if (durationMs <= 36 * 60 * 60 * 1000) return "the current day";
  if (durationMs <= 10 * 24 * 60 * 60 * 1000) return "the current week";
  return "the current month";
}

function shortId(value: string): string {
  return value.length > 8 ? value.slice(0, 8) : value;
}
