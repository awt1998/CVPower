import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { AUTOSAVE_DEBOUNCE_MS, RESUME_SCHEMA_VERSION, RESUME_STORAGE_KEY } from './constants';
import { createEmptyResumeData, createSampleResume } from './factory';
import { validateResumeData } from './schema';
import { runMigrations } from './migrations';
import { createDebouncedStorage, getSafeStorage } from './persistence';
import { createBackup, importBackup as importBackupData, serializeBackup } from './serialization';
import * as ops from './operations';
import type {
  ArraySectionItem,
  ArraySectionKey,
  Basics,
  BackupFile,
  CreateResumeInput,
  CustomItem,
  CustomSection,
  ImportMode,
  Resume,
  ResumeData,
  ResumeMeta,
} from './types';

/**
 * The resume store: a thin Zustand wrapper over the pure `operations`. All
 * business logic lives in the operations module; this layer only orchestrates
 * state updates and persistence. UI never talks to storage directly — it uses
 * this store (and `selectors`).
 */

export interface ResumeStoreActions {
  // Collection
  createResume: (input?: CreateResumeInput) => string;
  duplicateResume: (id: string) => string | null;
  deleteResume: (id: string) => void;
  setActiveResume: (id: string | null) => void;
  reorderResumes: (orderedIds: string[]) => void;
  renameResume: (id: string, title: string) => void;

  // Resume fields
  updateMeta: (id: string, patch: Partial<Omit<ResumeMeta, 'createdAt'>>) => void;
  updateBasics: (id: string, patch: Partial<Basics>) => void;

  // Array sections (experience, education, skills, projects, certifications, languages)
  addArrayItem: <K extends ArraySectionKey>(
    id: string,
    key: K,
    item: ArraySectionItem<K>,
  ) => void;
  updateArrayItem: <K extends ArraySectionKey>(
    id: string,
    key: K,
    itemId: string,
    patch: Partial<ArraySectionItem<K>>,
  ) => void;
  removeArrayItem: <K extends ArraySectionKey>(id: string, key: K, itemId: string) => void;
  reorderArrayItems: <K extends ArraySectionKey>(
    id: string,
    key: K,
    orderedIds: string[],
  ) => void;

  // Custom sections
  addCustomSection: (id: string, section: CustomSection) => void;
  updateCustomSection: (
    id: string,
    sectionId: string,
    patch: Partial<Omit<CustomSection, 'id' | 'items'>>,
  ) => void;
  removeCustomSection: (id: string, sectionId: string) => void;
  addCustomItem: (id: string, sectionId: string, item: CustomItem) => void;
  updateCustomItem: (
    id: string,
    sectionId: string,
    itemId: string,
    patch: Partial<Omit<CustomItem, 'id'>>,
  ) => void;
  removeCustomItem: (id: string, sectionId: string, itemId: string) => void;

  // Backups
  exportBackup: () => BackupFile;
  exportBackupString: () => string;
  importBackup: (input: string | unknown, mode?: ImportMode) => void;

  // Lifecycle
  reset: () => void;
  loadSample: () => string;
  getActiveResume: () => Resume | null;
}

export type ResumeStore = ResumeData & ResumeStoreActions;

export interface ResumeStoreOptions {
  /** Provide a storage adapter (used in tests). Defaults to debounced LocalStorage. */
  storage?: StateStorage;
  /** LocalStorage key. */
  storageKey?: string;
  /** Autosave debounce window in ms (ignored when `storage` is provided). */
  debounceMs?: number;
}

/** Extract just the persisted data fields from a full store snapshot. */
function dataOf(state: ResumeData): ResumeData {
  return {
    schemaVersion: state.schemaVersion,
    resumes: state.resumes,
    order: state.order,
    activeResumeId: state.activeResumeId,
  };
}

/**
 * Create an isolated resume store instance. The app uses the shared
 * `useResumeStore` singleton; tests create fresh instances with in-memory storage.
 */
export function createResumeStore(options: ResumeStoreOptions = {}) {
  const {
    storage,
    storageKey = RESUME_STORAGE_KEY,
    debounceMs = AUTOSAVE_DEBOUNCE_MS,
  } = options;

  const backingStorage: StateStorage =
    storage ?? createDebouncedStorage(getSafeStorage(), debounceMs);

  return create<ResumeStore>()(
    persist(
      (set, get) => ({
        ...createEmptyResumeData(),

        createResume: (input) => {
          const { data, id } = ops.createResume(dataOf(get()), input);
          set(data);
          return id;
        },
        duplicateResume: (id) => {
          const { data, id: newId } = ops.duplicateResume(dataOf(get()), id);
          if (newId) set(data);
          return newId;
        },
        deleteResume: (id) => set(ops.deleteResume(dataOf(get()), id)),
        setActiveResume: (id) => set(ops.setActiveResume(dataOf(get()), id)),
        reorderResumes: (orderedIds) => set(ops.reorderResumes(dataOf(get()), orderedIds)),
        renameResume: (id, title) => set(ops.renameResume(dataOf(get()), id, title)),

        updateMeta: (id, patch) => set(ops.updateMeta(dataOf(get()), id, patch)),
        updateBasics: (id, patch) => set(ops.updateBasics(dataOf(get()), id, patch)),

        addArrayItem: (id, key, item) => set(ops.addArrayItem(dataOf(get()), id, key, item)),
        updateArrayItem: (id, key, itemId, patch) =>
          set(ops.updateArrayItem(dataOf(get()), id, key, itemId, patch)),
        removeArrayItem: (id, key, itemId) =>
          set(ops.removeArrayItem(dataOf(get()), id, key, itemId)),
        reorderArrayItems: (id, key, orderedIds) =>
          set(ops.reorderArrayItems(dataOf(get()), id, key, orderedIds)),

        addCustomSection: (id, section) =>
          set(ops.addCustomSection(dataOf(get()), id, section)),
        updateCustomSection: (id, sectionId, patch) =>
          set(ops.updateCustomSection(dataOf(get()), id, sectionId, patch)),
        removeCustomSection: (id, sectionId) =>
          set(ops.removeCustomSection(dataOf(get()), id, sectionId)),
        addCustomItem: (id, sectionId, item) =>
          set(ops.addCustomItem(dataOf(get()), id, sectionId, item)),
        updateCustomItem: (id, sectionId, itemId, patch) =>
          set(ops.updateCustomItem(dataOf(get()), id, sectionId, itemId, patch)),
        removeCustomItem: (id, sectionId, itemId) =>
          set(ops.removeCustomItem(dataOf(get()), id, sectionId, itemId)),

        exportBackup: () => createBackup(dataOf(get())),
        exportBackupString: () => serializeBackup(dataOf(get())),
        importBackup: (input, mode = 'replace') =>
          set(importBackupData(dataOf(get()), input, mode)),

        reset: () => set(createEmptyResumeData()),
        loadSample: () => {
          const resume = createSampleResume();
          const withResume = ops.addResume(dataOf(get()), resume);
          set(ops.setActiveResume(withResume, resume.id));
          return resume.id;
        },
        getActiveResume: () => {
          const state = get();
          if (!state.activeResumeId) return null;
          return state.resumes[state.activeResumeId] ?? null;
        },
      }),
      {
        name: storageKey,
        version: RESUME_SCHEMA_VERSION,
        storage: createJSONStorage(() => backingStorage),
        partialize: (state) => dataOf(state),
        migrate: (persistedState, version) => {
          const migrated = runMigrations(persistedState, version);
          const parsed = validateResumeData(migrated);
          return parsed.success ? parsed.data : createEmptyResumeData();
        },
      },
    ),
  );
}

/** Shared application store singleton. */
export const useResumeStore = createResumeStore();
