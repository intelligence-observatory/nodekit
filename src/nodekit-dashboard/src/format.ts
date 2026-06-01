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

export function localTimeZoneLabel(): string {
  const zone = new Intl.DateTimeFormat([], { timeZoneName: "short" })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  return zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}
