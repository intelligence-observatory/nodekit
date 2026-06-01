import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

import { integerTicks, relativeTickLabel } from "./time-buckets";
import type { BucketRangeSelection, RunBucket, TimeRange } from "./types";

export interface RunChartController {
  destroy(): void;
}

export interface RunChartInteraction {
  selectedBucketRange: BucketRangeSelection | null;
  onBucketSelect(selection: BucketRangeSelection | null): void;
}

export function renderRunChart(
  parent: HTMLElement,
  buckets: RunBucket[],
  range: TimeRange,
  siteLensVisible: boolean,
  interaction: RunChartInteraction,
): RunChartController {
  parent.replaceChildren();
  if (buckets.length === 0) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "No cached Runs in this window";
    parent.append(empty);
    return { destroy() {} };
  }

  const x = buckets.map((_bucket, index) => index);
  const totals = buckets.map((bucket) => bucket.total);
  const selectedTotals = buckets.map((bucket) => bucket.selectedTotal);
  const timeSelectionTotals = buckets.map((bucket, index) =>
    bucketIsSelected(index, interaction.selectedBucketRange) ? bucket.total : 0,
  );
  const hasSelectedTotals = selectedTotals.some((value) => value > 0);
  const hasTimeSelection = interaction.selectedBucketRange !== null;
  const muteGlobal = siteLensVisible;
  const xSplits = xAxisSplits(buckets, range, parent.clientWidth);
  const max = Math.max(1, ...totals, ...selectedTotals, ...timeSelectionTotals);
  const ticks = integerTicks(Math.max(10, max));
  const hoverReadout = document.createElement("div");
  hoverReadout.className = "chart-readout";
  hoverReadout.textContent = selectedRangeLabel(buckets, interaction.selectedBucketRange, range);
  let mouseDownPosition: { x: number; y: number } | null = null;
  let mouseMovedWhileDown = false;
  let isSnappingSelect = false;
  const plot = new uPlot(
    {
      width: Math.max(parent.clientWidth, 320),
      height: 220,
      scales: {
        x: { range: [-0.5, buckets.length - 0.5] },
        y: { range: [0, Math.max(...ticks)] },
      },
      cursor: {
        show: true,
        x: false,
        y: false,
        points: { show: false },
        drag: {
          x: true,
          y: false,
          setScale: false,
          dist: 4,
        },
      },
      legend: { show: false },
      select: {
        show: true,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      axes: [
        {
          stroke: "#52616d",
          size: 34,
          gap: 8,
          label: "Time ago",
          labelSize: 22,
          labelGap: 4,
          font: "12px Inter, sans-serif",
          labelFont: "12px Inter, sans-serif",
          grid: { show: false },
          ticks: { show: false },
          border: { stroke: "rgba(82, 97, 109, 0.14)", width: 1 },
          splits: () => xSplits,
          values: (_u, values) => values.map((value) => xAxisLabel(Number(value), buckets, range)),
        },
        {
          stroke: "#52616d",
          size: 46,
          gap: 10,
          label: "Runs",
          labelSize: 28,
          labelGap: 8,
          font: "12px Inter, sans-serif",
          labelFont: "12px Inter, sans-serif",
          align: 2,
          alignTo: 2,
          grid: { stroke: "rgba(82, 97, 109, 0.10)", width: 1 },
          ticks: { show: false },
          border: { stroke: "rgba(82, 97, 109, 0.14)", width: 1 },
          splits: () => ticks,
          values: (_u, values) => values.map((value) => String(Math.round(Number(value)))),
        },
      ],
      series: [
        {},
        {
          label: "Runs",
          stroke: muteGlobal ? "rgba(82, 97, 109, 0.24)" : "#237a5d",
          fill: muteGlobal ? "rgba(82, 97, 109, 0.18)" : "#88d4b5",
          width: 0,
          points: { show: false },
          paths: uPlot.paths?.bars?.({ size: [1, Number.POSITIVE_INFINITY, 1], gap: 0 }),
        },
        {
          label: "Selected Range",
          stroke: "rgba(82, 97, 109, 0.16)",
          fill: hasTimeSelection ? "rgba(82, 97, 109, 0.16)" : "rgba(82, 97, 109, 0)",
          width: 0,
          points: { show: false },
          paths: uPlot.paths?.bars?.({ size: [1, Number.POSITIVE_INFINITY, 1], gap: 0 }),
        },
        {
          label: "Selected Sites",
          stroke: "#237a5d",
          fill: hasSelectedTotals ? "#88d4b5" : "rgba(136, 212, 181, 0)",
          width: 0,
          points: { show: false },
          paths: uPlot.paths?.bars?.({ size: [1, Number.POSITIVE_INFINITY, 1], gap: 0 }),
        },
      ],
      hooks: {
        ready: [
          (self) => {
            self.over.addEventListener("mousedown", (event) => {
              mouseDownPosition = { x: event.clientX, y: event.clientY };
              mouseMovedWhileDown = false;
            });
            self.over.addEventListener("mousemove", (event) => {
              if (mouseDownPosition !== null && clickMovedTooFar(event, mouseDownPosition)) {
                mouseMovedWhileDown = true;
              }
            });
            self.over.addEventListener("click", (event) => {
              const shouldIgnoreClick = mouseMovedWhileDown;
              mouseDownPosition = null;
              mouseMovedWhileDown = false;
              if (shouldIgnoreClick) return;
              const index = hitBucketIndex(self, event, buckets);
              if (index === null) return;
              interaction.onBucketSelect({ startIndex: index, endIndex: index });
            });
          },
        ],
        setCursor: [
          (self) => {
            const index = self.cursor.idx;
            hoverReadout.textContent =
              index === null || index === undefined
                ? selectedRangeLabel(buckets, interaction.selectedBucketRange, range)
                : bucketReadout(buckets[index], range);
          },
        ],
        setSelect: [
          (self) => {
            if (isSnappingSelect) return;
            if (self.select.width < 4) return;
            const selection = selectionFromPlotSelect(self, buckets.length);
            if (selection === null) return;
            const snappedSelect = snappedSelectBox(self, selection);
            isSnappingSelect = true;
            self.setSelect(snappedSelect, false);
            isSnappingSelect = false;
            interaction.onBucketSelect({
              startIndex: selection.startIndex,
              endIndex: selection.endIndex,
            });
          },
        ],
      },
    },
    [x, totals, timeSelectionTotals, selectedTotals],
    parent,
  );
  parent.append(hoverReadout);

  return {
    destroy() {
      plot.destroy();
    },
  };
}

function bucketIsSelected(index: number, selection: BucketRangeSelection | null): boolean {
  if (selection === null) return false;
  const start = Math.min(selection.startIndex, selection.endIndex);
  const end = Math.max(selection.startIndex, selection.endIndex);
  return index >= start && index <= end;
}

function hitBucketIndex(plot: uPlot, event: MouseEvent, buckets: RunBucket[]): number | null {
  const rect = plot.over.getBoundingClientRect();
  const index = indexFromPlotPosition(plot, event.clientX - rect.left, buckets.length);
  if (index === null) return null;
  const bucket = buckets[index];
  if (!bucket || bucket.total <= 0) return null;

  const y = event.clientY - rect.top;
  const valueTop = plot.valToPos(bucket.total, "y");
  const zeroBottom = plot.valToPos(0, "y");
  return y >= valueTop && y <= zeroBottom ? index : null;
}

function indexFromPlotPosition(plot: uPlot, left: number, bucketCount: number): number | null {
  if (left < 0 || left > plot.bbox.width) return null;
  return Math.max(0, Math.min(bucketCount - 1, plot.posToIdx(left)));
}

function selectionFromPlotSelect(
  plot: uPlot,
  bucketCount: number,
): BucketRangeSelection | null {
  const left = Math.max(0, Math.min(plot.bbox.width, plot.select.left));
  const right = Math.max(0, Math.min(plot.bbox.width, plot.select.left + plot.select.width));
  const startIndex = indexFromPlotPosition(plot, Math.min(left, right), bucketCount);
  const endIndex = indexFromPlotPosition(plot, Math.max(left, right), bucketCount);
  if (startIndex === null || endIndex === null) return null;
  return {
    startIndex: Math.min(startIndex, endIndex),
    endIndex: Math.max(startIndex, endIndex),
  };
}

function snappedSelectBox(
  plot: uPlot,
  selection: BucketRangeSelection,
): { left: number; top: number; width: number; height: number } {
  const left = Math.max(0, plot.valToPos(selection.startIndex - 0.5, "x"));
  const right = Math.min(plot.bbox.width, plot.valToPos(selection.endIndex + 0.5, "x"));
  return {
    left,
    top: plot.select.top,
    width: Math.max(0, right - left),
    height: plot.select.height,
  };
}

function clickMovedTooFar(
  event: MouseEvent,
  start: { x: number; y: number } | null,
): boolean {
  if (start === null) return false;
  return Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4;
}

function bucketReadout(bucket: RunBucket | undefined, range: TimeRange): string {
  if (!bucket) return selectedRangeLabel([], null, range);
  const siteCount = new Set(bucket.runs.map((row) => row.siteId)).size;
  return `${formatBucketInterval(bucket, range)} · ${bucket.total} Runs · ${siteCount} Sites`;
}

function selectedRangeLabel(
  buckets: RunBucket[],
  selection: BucketRangeSelection | null,
  range: TimeRange,
): string {
  if (selection === null) return "Hover or drag across Run Volume to inspect a time range";
  const start = Math.min(selection.startIndex, selection.endIndex);
  const end = Math.max(selection.startIndex, selection.endIndex);
  const selectedBuckets = buckets.slice(start, end + 1);
  const runCount = selectedBuckets.reduce((sum, bucket) => sum + bucket.total, 0);
  const siteCount = new Set(selectedBuckets.flatMap((bucket) => bucket.runs.map((row) => row.siteId)))
    .size;
  const startBucket = buckets[start];
  const endBucket = buckets[end];
  if (!startBucket || !endBucket) return "";
  return `Selected ${formatInterval(startBucket.startMs, endBucket.endMs, range)} · ${runCount} Runs · ${siteCount} Sites`;
}

function formatBucketInterval(bucket: RunBucket, range: TimeRange): string {
  return formatInterval(bucket.startMs, bucket.endMs, range);
}

function formatInterval(startMs: number, endMs: number, range: TimeRange): string {
  const options: Intl.DateTimeFormatOptions =
    range.labelUnit === "hour"
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", hour: "numeric" };
  const start = new Date(startMs).toLocaleString([], options);
  const end = new Date(endMs).toLocaleString([], options);
  return `${start} - ${end}`;
}

function xAxisSplits(buckets: RunBucket[], range: TimeRange, width: number): number[] {
  const maxLabels = width < 520 ? 5 : 8;
  const labelUnitMs = range.labelUnit === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const totalUnits = Math.round((range.endMs - range.startMs) / labelUnitMs);
  const stepUnits = niceLabelStep(Math.max(1, Math.ceil(totalUnits / (maxLabels - 1))));
  const values: number[] = [];
  for (let unitsFromStart = 0; unitsFromStart < totalUnits; unitsFromStart += stepUnits) {
    values.push(Math.round((unitsFromStart * labelUnitMs) / range.bucketMs));
  }
  values.push(buckets.length - 1);
  return [...new Set(values)];
}

function xAxisLabel(index: number, buckets: RunBucket[], range: TimeRange): string {
  const bucket = buckets[Math.max(0, Math.min(buckets.length - 1, Math.round(index)))];
  if (!bucket) return "";
  const timestampMs = index >= buckets.length - 1 ? range.endMs : bucket.startMs;
  return relativeTickLabel(timestampMs, range);
}

function niceLabelStep(target: number): number {
  for (const step of [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30]) {
    if (target <= step) return step;
  }
  return Math.ceil(target / 10) * 10;
}
