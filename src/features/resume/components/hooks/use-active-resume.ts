'use client';

import { useResumeStore } from '../../store';
import type { Resume } from '../../types';

/** Subscribe to the currently active resume (or null). Stable across unrelated updates. */
export function useActiveResume(): Resume | null {
  return useResumeStore((state) =>
    state.activeResumeId ? (state.resumes[state.activeResumeId] ?? null) : null,
  );
}
