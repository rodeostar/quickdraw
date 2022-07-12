export type LogLevel = "quiet" | "verbose" | "default";

export const STARTUP_LOG_LEVEL: LogLevel = "quiet";

export const HMR_PORT = 5555;

export const HMR_PATH = "ws://localhost:" + HMR_PORT;
