import type {ISO8601} from "./types/common.ts";

export function performanceNowToISO8601(
    performanceNowMsec: DOMHighResTimeStamp // as returned by performance.now()
): ISO8601 {
    const timestampMsec = performance.timeOrigin + performanceNowMsec;
    return new Date(timestampMsec).toISOString() as ISO8601;
}

