import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

import { integerTicks, relativeTickLabel } from "./time-buckets";
import type { RunBucket, TimeRange } from "./types";

export interface RunChartController {
  destroy(): void;
}

export function renderRunChart(
  parent: HTMLElement,
  buckets: RunBucket[],
  range: TimeRange,
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
  const xSplits = xAxisSplits(buckets, range, parent.clientWidth);
  const max = Math.max(1, ...totals);
  const ticks = integerTicks(Math.max(10, max));
  const plot = new uPlot(
    {
      width: Math.max(parent.clientWidth, 320),
      height: 220,
      scales: {
        x: { range: [-0.5, buckets.length - 0.5] },
        y: { range: [0, Math.max(...ticks)] },
      },
      cursor: {
        drag: { x: false, y: false },
      },
      legend: { show: false },
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
          stroke: "#237a5d",
          fill: "#88d4b5",
          width: 0,
          points: { show: false },
          paths: uPlot.paths?.bars?.({ size: [0.72, 80], gap: 2 }),
        },
      ],
    },
    [x, totals],
    parent,
  );

  return {
    destroy() {
      plot.destroy();
    },
  };
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
