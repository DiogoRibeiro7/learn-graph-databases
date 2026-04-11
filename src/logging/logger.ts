/**
 * Lightweight structured logger for the application.
 *
 * Supports JSON output for machine-readable logs and a human-friendly plain text mode.
 */
const LEVELS = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof LEVELS)[number];

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";
const outputAsJson = process.env.LOG_FORMAT === "json";

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[configuredLevel];
}

function formatMeta(meta: Record<string, unknown> = {}): string {
  return outputAsJson ? JSON.stringify(meta) : Object.entries(meta)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");
}

function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (outputAsJson) {
    console.log(JSON.stringify(payload));
    return;
  }

  const info = formatMeta(meta);
  const line = `[${payload.timestamp}] [${level.toUpperCase()}] ${message}${info ? ` ${info}` : ""}`;

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, meta: Record<string, unknown> = {}) => log("debug", message, meta),
  info: (message: string, meta: Record<string, unknown> = {}) => log("info", message, meta),
  warn: (message: string, meta: Record<string, unknown> = {}) => log("warn", message, meta),
  error: (message: string, meta: Record<string, unknown> = {}) => log("error", message, meta),
};
