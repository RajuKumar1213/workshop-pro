/**
 * Lightweight logger utility.
 *
 * In development: uses console with colored prefix.
 * In production: structured JSON logging (replace with Pino/Winston if needed).
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

function createLog(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

function writeLog(entry: LogEntry): void {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const prefix = {
      info: '\x1b[36m[INFO]\x1b[0m',
      warn: '\x1b[33m[WARN]\x1b[0m',
      error: '\x1b[31m[ERROR]\x1b[0m',
      debug: '\x1b[35m[DEBUG]\x1b[0m',
    }[entry.level];

    const args: unknown[] = [`${prefix} ${entry.message}`];
    if (entry.data !== undefined) args.push(entry.data);
    console[entry.level === 'debug' ? 'log' : entry.level](...args);
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, data?: unknown) => writeLog(createLog('info', message, data)),
  warn: (message: string, data?: unknown) => writeLog(createLog('warn', message, data)),
  error: (message: string, data?: unknown) => writeLog(createLog('error', message, data)),
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog(createLog('debug', message, data));
    }
  },
};
