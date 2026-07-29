import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSafeStorage } from '@/features/resume/persistence';
import type { CoverLetter } from './assemble';

interface CoverLetterStore extends CoverLetter {
  setField: <K extends keyof CoverLetter>(key: K, value: CoverLetter[K]) => void;
  reset: () => void;
}

const EMPTY: CoverLetter = {
  senderName: '',
  recipientName: '',
  company: '',
  role: '',
  intro: '',
  body: '',
  closing: '',
};

/** Persists the current cover letter on-device. */
export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      setField: (key, value) => set({ [key]: value } as Partial<CoverLetterStore>),
      reset: () => set(EMPTY),
    }),
    {
      name: 'cvpower:cover-letter',
      storage: createJSONStorage(() => getSafeStorage()),
      partialize: (state) => ({
        senderName: state.senderName,
        recipientName: state.recipientName,
        company: state.company,
        role: state.role,
        intro: state.intro,
        body: state.body,
        closing: state.closing,
      }),
    },
  ),
);
