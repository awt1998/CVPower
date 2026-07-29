/**
 * Current persisted schema version for the resume engine. Bump this whenever the
 * shape of persisted data changes, and add a matching step in `migrations.ts`.
 */
export const RESUME_SCHEMA_VERSION = 2;

/** LocalStorage key for the persisted resume store. */
export const RESUME_STORAGE_KEY = 'cvpower:resume-store';

/** Autosave debounce window (ms) for persistence writes. */
export const AUTOSAVE_DEBOUNCE_MS = 500;

/** Identifier used to recognize a CVPower JSON backup file. */
export const BACKUP_KIND = 'cvpower-backup';

/** Array-based resume sections that share generic CRUD operations. */
export const ARRAY_SECTION_KEYS = [
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'references',
] as const;

/** All resume section keys (array sections + the structured `custom` section). */
export const SECTION_KEYS = [...ARRAY_SECTION_KEYS, 'custom'] as const;

/** Language proficiency levels (CEFR-inspired, resume-friendly wording). */
export const LANGUAGE_PROFICIENCIES = [
  'elementary',
  'limited',
  'professional',
  'full',
  'native',
] as const;

/** Optional self-rated skill levels. */
export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
