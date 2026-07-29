import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSafeStorage } from '@/features/resume/persistence';

export interface ScoreSnapshot {
  at: string;
  value: number;
}

interface AnalyticsStore {
  history: Record<string, ScoreSnapshot[]>;
  /** Record a score for a resume, keeping one (latest) snapshot per day, capped at 60. */
  record: (resumeId: string, value: number) => void;
  clear: () => void;
}

const MAX_POINTS = 60;

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      history: {},
      record: (resumeId, value) =>
        set((state) => {
          const list = state.history[resumeId] ?? [];
          const today = new Date().toISOString().slice(0, 10);
          const last = list[list.length - 1];
          const trimmed = last && last.at.slice(0, 10) === today ? list.slice(0, -1) : list;
          if (last && last.at.slice(0, 10) === today && last.value === value) return state;
          const next = [...trimmed, { at: new Date().toISOString(), value }].slice(-MAX_POINTS);
          return { history: { ...state.history, [resumeId]: next } };
        }),
      clear: () => set({ history: {} }),
    }),
    {
      name: 'cvpower:analytics',
      storage: createJSONStorage(() => getSafeStorage()),
    },
  ),
);
