export function formatDateTimeWithZone(value: string): string {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

export function formatTimeAgo(value: string, nowMs = Date.now()): string {
  const timestampMs = Date.parse(value);
  if (Number.isNaN(timestampMs)) return "unknown";
  const diffSeconds = Math.max(0, Math.floor((nowMs - timestampMs) / 1000));
  if (diffSeconds < 5) return "just now";
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return plural(diffMinutes, "minute");

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return plural(diffHours, "hour");

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return plural(diffDays, "day");

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return plural(diffMonths, "month");

  return plural(Math.floor(diffDays / 365), "year");
}

export function formatMinuteTimeAgo(value: string, nowMs = Date.now()): string {
  const timestampMs = Date.parse(value);
  if (Number.isNaN(timestampMs)) return "unknown";
  const diffSeconds = Math.max(0, Math.floor((nowMs - timestampMs) / 1000));
  if (diffSeconds < 60) return "<1 minute ago";
  return formatTimeAgo(value, nowMs);
}

export function localTimeZoneLabel(): string {
  const zone = new Intl.DateTimeFormat([], { timeZoneName: "short" })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  return zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function plural(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
