import { create } from "zustand";

export type UndoAction = {
  id: string;
  label: string;
  ts: number;
  mergeKey?: string;
  undo: () => void;
  redo: () => void;
};

type RecordOptions = {
  mergeKey?: string;
  mergeMs?: number;
};

type UndoState = {
  past: UndoAction[];
  future: UndoAction[];
  isApplying: boolean;
  record: (action: Omit<UndoAction, "id" | "ts" | "mergeKey">, opts?: RecordOptions) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
};

const LIMIT = 120;

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useUndoStore = create<UndoState>()((set, get) => ({
  past: [],
  future: [],
  isApplying: false,

  record: (action, opts) => {
    const state = get();
    if (state.isApplying) return;
    const ts = Date.now();
    const mergeKey = opts?.mergeKey;
    const mergeMs = typeof opts?.mergeMs === "number" ? opts.mergeMs : 900;

    set((s) => {
      const prev = s.past[s.past.length - 1] ?? null;
      if (mergeKey && prev?.mergeKey === mergeKey && ts - prev.ts <= mergeMs) {
        const merged: UndoAction = {
          ...prev,
          label: action.label || prev.label,
          ts,
          redo: action.redo,
        };
        const nextPast = [...s.past.slice(0, -1), merged].slice(-LIMIT);
        return { past: nextPast, future: [] };
      }

      const next: UndoAction = { id: newId(), label: action.label, ts, mergeKey, undo: action.undo, redo: action.redo };
      return { past: [...s.past, next].slice(-LIMIT), future: [] };
    });
  },

  undo: () => {
    const { past, future } = get();
    if (!past.length) return;
    const action = past[past.length - 1]!;
    set({ isApplying: true, past: past.slice(0, -1), future: [action, ...future].slice(-LIMIT) });
    try {
      action.undo();
    } finally {
      set({ isApplying: false });
    }
  },

  redo: () => {
    const { past, future } = get();
    if (!future.length) return;
    const action = future[0]!;
    set({ isApplying: true, past: [...past, action].slice(-LIMIT), future: future.slice(1) });
    try {
      action.redo();
    } finally {
      set({ isApplying: false });
    }
  },

  clear: () => set({ past: [], future: [] }),
}));

