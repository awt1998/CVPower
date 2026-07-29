import { createId } from '@/lib/id';
import { createResume as buildResume, now } from './factory';
import type {
  ArraySectionItem,
  ArraySectionKey,
  Basics,
  CreateResumeInput,
  CustomItem,
  CustomSection,
  Resume,
  ResumeData,
  ResumeMeta,
  ResumeSections,
} from './types';

/**
 * Pure, framework-free state transforms. Every function takes the current
 * `ResumeData` and returns a NEW `ResumeData` (no mutation). The Zustand store
 * is a thin wrapper over these, which keeps all business logic unit-testable
 * without React or a browser.
 */

/* ----------------------------- helpers ----------------------------- */

function deepClone<T>(value: T): T {
  const sc = (globalThis as { structuredClone?: <U>(v: U) => U }).structuredClone;
  return sc ? sc(value) : (JSON.parse(JSON.stringify(value)) as T);
}

/** Return a copy of the resume with a refreshed `updatedAt`. */
function touch(resume: Resume): Resume {
  return { ...resume, meta: { ...resume.meta, updatedAt: now() } };
}

/** Deep-clone a resume and assign fresh ids to it and every nested item. */
function withNewIds(resume: Resume): Resume {
  const clone = deepClone(resume);
  clone.id = createId();
  clone.basics.links = clone.basics.links.map((l) => ({ ...l, id: createId() }));
  clone.sections.experience = clone.sections.experience.map((x) => ({ ...x, id: createId() }));
  clone.sections.education = clone.sections.education.map((x) => ({ ...x, id: createId() }));
  clone.sections.skills = clone.sections.skills.map((x) => ({ ...x, id: createId() }));
  clone.sections.projects = clone.sections.projects.map((x) => ({ ...x, id: createId() }));
  clone.sections.certifications = clone.sections.certifications.map((x) => ({
    ...x,
    id: createId(),
  }));
  clone.sections.languages = clone.sections.languages.map((x) => ({ ...x, id: createId() }));
  clone.sections.references = clone.sections.references.map((x) => ({ ...x, id: createId() }));
  clone.sections.custom = clone.sections.custom.map((section) => ({
    ...section,
    id: createId(),
    items: section.items.map((item) => ({ ...item, id: createId() })),
  }));
  return clone;
}

/** Replace a resume in the collection, refreshing its timestamp. */
function replaceResume(data: ResumeData, resume: Resume): ResumeData {
  return { ...data, resumes: { ...data.resumes, [resume.id]: touch(resume) } };
}

/** Apply a pure updater to one resume (no-op if it doesn't exist). */
function mutateResume(
  data: ResumeData,
  id: string,
  updater: (resume: Resume) => Resume,
): ResumeData {
  const existing = data.resumes[id];
  if (!existing) return data;
  return replaceResume(data, updater(existing));
}

function setArraySection<K extends ArraySectionKey>(
  resume: Resume,
  key: K,
  items: ArraySectionItem<K>[],
): Resume {
  return {
    ...resume,
    sections: { ...resume.sections, [key]: items } as ResumeSections,
  };
}

function getArraySection<K extends ArraySectionKey>(
  resume: Resume,
  key: K,
): ArraySectionItem<K>[] {
  return resume.sections[key] as unknown as ArraySectionItem<K>[];
}

/** Reorder a list to match `orderedIds`; unknown ids are ignored, missing ids kept at end. */
function applyOrder<T extends { id: string }>(items: T[], orderedIds: string[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  for (const id of orderedIds) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  // Preserve any items not referenced in orderedIds, in their original order.
  for (const item of items) {
    if (byId.has(item.id)) ordered.push(item);
  }
  return ordered;
}

/* ------------------------- resume collection ------------------------ */

export function addResume(data: ResumeData, resume: Resume): ResumeData {
  return {
    ...data,
    resumes: { ...data.resumes, [resume.id]: resume },
    order: [...data.order, resume.id],
    activeResumeId: data.activeResumeId ?? resume.id,
  };
}

export function createResume(
  data: ResumeData,
  input?: CreateResumeInput,
): { data: ResumeData; id: string } {
  const resume = buildResume(input);
  return { data: addResume(data, resume), id: resume.id };
}

export function duplicateResume(
  data: ResumeData,
  id: string,
): { data: ResumeData; id: string | null } {
  const source = data.resumes[id];
  if (!source) return { data, id: null };

  const copy = withNewIds(source);
  const timestamp = now();
  copy.meta = {
    ...copy.meta,
    title: `${source.meta.title} (copy)`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Insert the copy directly after the source in the order.
  const index = data.order.indexOf(id);
  const nextOrder = [...data.order];
  nextOrder.splice(index === -1 ? nextOrder.length : index + 1, 0, copy.id);

  return {
    data: {
      ...data,
      resumes: { ...data.resumes, [copy.id]: copy },
      order: nextOrder,
      activeResumeId: copy.id,
    },
    id: copy.id,
  };
}

export function deleteResume(data: ResumeData, id: string): ResumeData {
  if (!data.resumes[id]) return data;

  const nextResumes = { ...data.resumes };
  delete nextResumes[id];

  const removedIndex = data.order.indexOf(id);
  const nextOrder = data.order.filter((rid) => rid !== id);

  let nextActive = data.activeResumeId;
  if (data.activeResumeId === id) {
    // Prefer the item that shifted into this slot, else the previous one, else none.
    nextActive = nextOrder[removedIndex] ?? nextOrder[removedIndex - 1] ?? nextOrder[0] ?? null;
  }

  return { ...data, resumes: nextResumes, order: nextOrder, activeResumeId: nextActive };
}

export function setActiveResume(data: ResumeData, id: string | null): ResumeData {
  if (id !== null && !data.resumes[id]) return data;
  return { ...data, activeResumeId: id };
}

export function reorderResumes(data: ResumeData, orderedIds: string[]): ResumeData {
  const known = new Set(data.order);
  const next = orderedIds.filter((id) => known.has(id));
  for (const id of data.order) if (!next.includes(id)) next.push(id);
  return { ...data, order: next };
}

export function renameResume(data: ResumeData, id: string, title: string): ResumeData {
  return mutateResume(data, id, (r) => ({ ...r, meta: { ...r.meta, title } }));
}

export function updateMeta(
  data: ResumeData,
  id: string,
  patch: Partial<Omit<ResumeMeta, 'createdAt'>>,
): ResumeData {
  return mutateResume(data, id, (r) => ({ ...r, meta: { ...r.meta, ...patch } }));
}

export function updateBasics(data: ResumeData, id: string, patch: Partial<Basics>): ResumeData {
  return mutateResume(data, id, (r) => ({ ...r, basics: { ...r.basics, ...patch } }));
}

/* --------------------------- array sections -------------------------- */

export function addArrayItem<K extends ArraySectionKey>(
  data: ResumeData,
  id: string,
  key: K,
  item: ArraySectionItem<K>,
): ResumeData {
  return mutateResume(data, id, (r) => setArraySection(r, key, [...getArraySection(r, key), item]));
}

export function updateArrayItem<K extends ArraySectionKey>(
  data: ResumeData,
  id: string,
  key: K,
  itemId: string,
  patch: Partial<ArraySectionItem<K>>,
): ResumeData {
  return mutateResume(data, id, (r) =>
    setArraySection(
      r,
      key,
      getArraySection(r, key).map((item) =>
        item.id === itemId
          ? ({ ...item, ...patch, id: item.id } as ArraySectionItem<K>)
          : item,
      ),
    ),
  );
}

export function removeArrayItem<K extends ArraySectionKey>(
  data: ResumeData,
  id: string,
  key: K,
  itemId: string,
): ResumeData {
  return mutateResume(data, id, (r) =>
    setArraySection(
      r,
      key,
      getArraySection(r, key).filter((item) => item.id !== itemId),
    ),
  );
}

export function reorderArrayItems<K extends ArraySectionKey>(
  data: ResumeData,
  id: string,
  key: K,
  orderedIds: string[],
): ResumeData {
  return mutateResume(data, id, (r) =>
    setArraySection(r, key, applyOrder(getArraySection(r, key), orderedIds)),
  );
}

/* --------------------------- custom sections ------------------------- */

export function addCustomSection(
  data: ResumeData,
  id: string,
  section: CustomSection,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: { ...r.sections, custom: [...r.sections.custom, section] },
  }));
}

export function updateCustomSection(
  data: ResumeData,
  id: string,
  sectionId: string,
  patch: Partial<Omit<CustomSection, 'id' | 'items'>>,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: {
      ...r.sections,
      custom: r.sections.custom.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    },
  }));
}

export function removeCustomSection(
  data: ResumeData,
  id: string,
  sectionId: string,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: { ...r.sections, custom: r.sections.custom.filter((s) => s.id !== sectionId) },
  }));
}

export function addCustomItem(
  data: ResumeData,
  id: string,
  sectionId: string,
  item: CustomItem,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: {
      ...r.sections,
      custom: r.sections.custom.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s,
      ),
    },
  }));
}

export function updateCustomItem(
  data: ResumeData,
  id: string,
  sectionId: string,
  itemId: string,
  patch: Partial<Omit<CustomItem, 'id'>>,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: {
      ...r.sections,
      custom: r.sections.custom.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : s,
      ),
    },
  }));
}

export function removeCustomItem(
  data: ResumeData,
  id: string,
  sectionId: string,
  itemId: string,
): ResumeData {
  return mutateResume(data, id, (r) => ({
    ...r,
    sections: {
      ...r.sections,
      custom: r.sections.custom.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s,
      ),
    },
  }));
}

/* ----------------------------- bulk import --------------------------- */

/** Replace all resumes with the provided set (active becomes the first). */
export function replaceAllResumes(data: ResumeData, resumes: Resume[]): ResumeData {
  const map: Record<string, Resume> = {};
  const order: string[] = [];
  for (const resume of resumes) {
    map[resume.id] = resume;
    order.push(resume.id);
  }
  return {
    ...data,
    resumes: map,
    order,
    activeResumeId: order[0] ?? null,
  };
}

/** Append imported resumes, giving each fresh ids to avoid collisions. */
export function mergeResumes(data: ResumeData, resumes: Resume[]): ResumeData {
  let next = data;
  for (const resume of resumes) {
    next = addResume(next, withNewIds(resume));
  }
  return next;
}
