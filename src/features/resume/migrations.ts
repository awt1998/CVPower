import { RESUME_SCHEMA_VERSION } from './constants';
import { createEmptyResumeData } from './factory';
import type { ResumeData } from './types';

/**
 * Versioned data migrations. Persisted data carries a `schemaVersion`; when the
 * app loads older data, each step upgrades it one version at a time until it
 * matches `RESUME_SCHEMA_VERSION`. Add a new numbered step whenever the persisted
 * shape changes — never mutate an existing step.
 */

type UnknownRecord = Record<string, unknown>;

/** Transforms persisted state from version `n - 1` to version `n`. */
type MigrationStep = (state: UnknownRecord) => UnknownRecord;

const migrationSteps: Record<number, MigrationStep> = {
  // v0 -> v1: an early prototype stored `resumes` as a plain array. Convert it to
  // the id-keyed record + explicit `order` used from v1 onward.
  1: (state) => {
    const legacy = state.resumes;
    if (Array.isArray(legacy)) {
      const resumes: UnknownRecord = {};
      const order: string[] = [];
      for (const entry of legacy) {
        if (entry && typeof entry === 'object' && 'id' in entry) {
          const id = String((entry as UnknownRecord).id);
          resumes[id] = entry as UnknownRecord;
          order.push(id);
        }
      }
      return { ...state, resumes, order, activeResumeId: order[0] ?? null };
    }
    return state;
  },

  // v1 -> v2: the `references` section was added. Backfill an empty array on every
  // existing resume so it satisfies the current schema.
  2: (state) => {
    const resumes = state.resumes;
    if (!resumes || typeof resumes !== 'object' || Array.isArray(resumes)) return state;

    const next: UnknownRecord = {};
    for (const [id, entry] of Object.entries(resumes as UnknownRecord)) {
      if (entry && typeof entry === 'object') {
        const resume = entry as UnknownRecord;
        const sections =
          resume.sections && typeof resume.sections === 'object'
            ? (resume.sections as UnknownRecord)
            : {};
        next[id] = {
          ...resume,
          schemaVersion: 2,
          sections: { references: [], ...sections },
        };
      } else {
        next[id] = entry;
      }
    }
    return { ...state, resumes: next };
  },
};

/**
 * Upgrade persisted state to the current schema version. `fromVersion` is the
 * version the data was stored at. Returns a best-effort `ResumeData`; callers
 * should validate the result (the store does) before trusting it.
 */
export function runMigrations(persistedState: unknown, fromVersion: number): ResumeData {
  if (!persistedState || typeof persistedState !== 'object') {
    return createEmptyResumeData();
  }

  let state = { ...(persistedState as UnknownRecord) };
  const start = Number.isFinite(fromVersion) && fromVersion > 0 ? fromVersion : 0;

  for (let version = start + 1; version <= RESUME_SCHEMA_VERSION; version++) {
    const step = migrationSteps[version];
    if (step) state = step(state);
  }

  state.schemaVersion = RESUME_SCHEMA_VERSION;
  return state as unknown as ResumeData;
}
