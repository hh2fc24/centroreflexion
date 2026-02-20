import type { StateStorage } from "zustand/middleware";

export const isBrowser = () => typeof window !== "undefined";

export const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

