/**
 * Structured logger for the application.
 *
 * Supports machine-readable JSON logs and a plain-text fallback while
 * preserving a consistent event shape with shared metadata.
 */
const LEVELS = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof LEVELS)[number];

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

type LogMeta = Record<string, unknown>;

export type Logger = Readonly<{
  debug: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  child: (bindings: LogMeta) => Logger;
}>;

function parseLogLevel(value: string | undefined): LogLevel {
  if (!value) {
    return "info";
  }

  const normalized = value.trim().toLowerCase();
  if (LEVELS.includes(normalized as LogLevel)) {
    return normalized as LogLevel;
  }

  return "info";
}

const configuredLevel = parseLogLevel(process.env.LOG_LEVEL);
const outputAsJson = process.env.LOG_FORMAT === "json";
const serviceName = process.env.LOG_SERVICE ?? "learn-graph-databases";
const environmentName = process.env.NODE_ENV ?? "development";

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[configuredLevel];
}

function formatMeta(meta: LogMeta): string {
  return Object.entries(meta)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");
}

function writeLogLine(level: LogLevel, line: string): void {
  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

function createLogger(bindings: LogMeta = {}): Logger {
  function log(level: LogLevel, message: string, meta: LogMeta = {}): void {
    if (!shouldLog(level)) {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: serviceName,
      env: environmentName,
      pid: process.pid,
      ...bindings,
      ...meta,
    };

    if (outputAsJson) {
      writeLogLine(level, JSON.stringify(payload));
      return;
    }

    const { timestamp, ...rest } = payload;
    const restMeta = formatMeta(rest);
    const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${restMeta ? ` ${restMeta}` : ""}`;
    writeLogLine(level, line);
  }

  return {
    debug: (message: string, meta: LogMeta = {}) => log("debug", message, meta),
    info: (message: string, meta: LogMeta = {}) => log("info", message, meta),
    warn: (message: string, meta: LogMeta = {}) => log("warn", message, meta),
    error: (message: string, meta: LogMeta = {}) => log("error", message, meta),
    child: (childBindings: LogMeta) => createLogger({ ...bindings, ...childBindings }),
  };
}

export const logger = createLogger();
