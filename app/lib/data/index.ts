import "server-only";

export type DataMode = "mock" | "live";

export const DATA_MODE: DataMode =
  process.env.DATA_MODE === "live" ? "live" : "mock";

export const IS_LIVE = DATA_MODE === "live";
export const IS_MOCK = DATA_MODE === "mock";
