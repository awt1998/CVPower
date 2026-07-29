import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSafeStorage } from '@/features/resume/persistence';

interface JobStore {
  jobText: string;
  setJobText: (value: string) => void;
  clear: () => void;
}

/** Persists the current job-description text (on-device) so analysis survives reloads. */
export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      jobText: '',
      setJobText: (value) => set({ jobText: value }),
      clear: () => set({ jobText: '' }),
    }),
    {
      name: 'cvpower:job',
      storage: createJSONStorage(() => getSafeStorage()),
    },
  ),
);
