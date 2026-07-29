import { createId } from '@/lib/id';
import { RESUME_SCHEMA_VERSION } from './constants';
import type {
  Basics,
  CertificationItem,
  CreateResumeInput,
  CustomItem,
  CustomSection,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  Link,
  ProjectItem,
  ReferenceItem,
  Resume,
  ResumeData,
  ResumeSections,
  SkillGroup,
} from './types';

/** Current timestamp as an ISO string. Centralized so tests can reason about it. */
export function now(): string {
  return new Date().toISOString();
}

export function createEmptyBasics(overrides: Partial<Basics> = {}): Basics {
  return {
    fullName: '',
    links: [],
    ...overrides,
  };
}

export function createEmptySections(): ResumeSections {
  return {
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    references: [],
    custom: [],
  };
}

export function createResume(input: CreateResumeInput = {}): Resume {
  const timestamp = now();
  return {
    id: createId(),
    schemaVersion: RESUME_SCHEMA_VERSION,
    meta: {
      title: input.title?.trim() || 'Untitled resume',
      createdAt: timestamp,
      updatedAt: timestamp,
      ...(input.templateId ? { templateId: input.templateId } : {}),
      ...(input.locale ? { locale: input.locale } : {}),
    },
    basics: createEmptyBasics(input.basics),
    sections: createEmptySections(),
  };
}

export function createEmptyResumeData(): ResumeData {
  return {
    schemaVersion: RESUME_SCHEMA_VERSION,
    resumes: {},
    order: [],
    activeResumeId: null,
  };
}

/* ------------------------------------------------------------------ *
 * Section item factories — each returns a fresh item with a unique id.
 * ------------------------------------------------------------------ */

export function createLink(overrides: Partial<Omit<Link, 'id'>> = {}): Link {
  return { id: createId(), label: '', url: '', ...overrides };
}

export function createExperience(
  overrides: Partial<Omit<ExperienceItem, 'id'>> = {},
): ExperienceItem {
  return {
    id: createId(),
    company: '',
    role: '',
    current: false,
    highlights: [],
    ...overrides,
  };
}

export function createEducation(
  overrides: Partial<Omit<EducationItem, 'id'>> = {},
): EducationItem {
  return {
    id: createId(),
    institution: '',
    degree: '',
    current: false,
    highlights: [],
    ...overrides,
  };
}

export function createSkillGroup(
  overrides: Partial<Omit<SkillGroup, 'id'>> = {},
): SkillGroup {
  return { id: createId(), category: '', items: [], ...overrides };
}

export function createProject(overrides: Partial<Omit<ProjectItem, 'id'>> = {}): ProjectItem {
  return { id: createId(), name: '', highlights: [], ...overrides };
}

export function createCertification(
  overrides: Partial<Omit<CertificationItem, 'id'>> = {},
): CertificationItem {
  return { id: createId(), name: '', ...overrides };
}

export function createLanguage(
  overrides: Partial<Omit<LanguageItem, 'id'>> = {},
): LanguageItem {
  return { id: createId(), name: '', proficiency: 'professional', ...overrides };
}

export function createReference(
  overrides: Partial<Omit<ReferenceItem, 'id'>> = {},
): ReferenceItem {
  return { id: createId(), name: '', ...overrides };
}

export function createCustomItem(
  overrides: Partial<Omit<CustomItem, 'id'>> = {},
): CustomItem {
  return { id: createId(), highlights: [], ...overrides };
}

export function createCustomSection(
  overrides: Partial<Omit<CustomSection, 'id'>> = {},
): CustomSection {
  return { id: createId(), title: '', items: [], ...overrides };
}
