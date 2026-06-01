import type { HealthStatus, HealthStatusKind } from "./types";

export function healthClass(status: HealthStatus | null): string {
  return `health-light health-${healthKind(status)}`;
}

export function healthLabel(status: HealthStatus | null): string {
  const kind = healthKind(status);
  if (kind === "ok") return "Server reachable";
  if (kind === "unreachable") return status?.message ? `Server unreachable: ${status.message}` : "Server unreachable";
  return "Server disconnected";
}

function healthKind(status: HealthStatus | null): HealthStatusKind {
  return status?.status ?? "disconnected";
}
