export type ErrorReport = {
    title: string,
    timestamp: string,
    url: string,
    userAgent: string,
    context: Record<string, unknown> | null,
    error: {
        name: string,
        message: string,
        stack?: string[],
    } | {
        name: "UnknownError",
        message: "Unknown error",
    },
};

export function formatErrorReport(
    err: unknown,
    context: Record<string, unknown> | null = null,
): ErrorReport {
    const error = err as Error | null;
    const stack = error?.stack
        ? error.stack.split("\n").map((line) => line.trim()).filter(Boolean)
        : undefined;
    return {
        title: "NodeKit Error Report",
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "unknown",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        context,
        error: error
            ? {
                name: error.name || "Error",
                message: error.message || String(error),
                stack,
            }
            : {
                name: "UnknownError",
                message: "Unknown error",
            },
    };
}
