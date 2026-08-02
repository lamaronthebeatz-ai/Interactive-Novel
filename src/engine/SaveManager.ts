import type { GameState } from "./types";

const SAVE_KEY = "linh-truyen-save-v1";

export const SaveManager = {
  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  save(state: GameState): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  },

  load(): GameState | null {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameState;
    } catch {
      return null;
    }
  },
};
