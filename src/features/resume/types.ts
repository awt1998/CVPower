import type { z } from 'zod';
import type { ARRAY_SECTION_KEYS, SECTION_KEYS } from './constants';
import type {
  basicsSchema,
  certificationSchema,
  customItemSchema,
  customSectionSchema,
  educationSchema,
  experienceSchema,
  languageSchema,
  linkSchema,
  locationSchema,
  projectSchema,
  referenceSchema,
  resumeDataSchema,
  resumeMetaSchema,
  resumeSchema,
  resumeSectionsSchema,
  skillGroupSchema,
  backupSchema,
} from './schema';

/**
 * All domain types are inferred from the Zod schemas so types and validation
 * stay in lockstep. Do not hand-edit these to diverge from `schema.ts`.
 */
export type Link = z.infer<typeof linkSchema>;
export type ResumeLocation = z.infer<typeof locationSchema>;
export type Basics = z.infer<typeof basicsSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type ProjectItem = z.infer<typeof projectSchema>;
export type CertificationItem = z.infer<typeof certificationSchema>;
export type LanguageItem = z.infer<typeof languageSchema>;
export type ReferenceItem = z.infer<typeof referenceSchema>;
export type CustomItem = z.infer<typeof customItemSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type ResumeSections = z.infer<typeof resumeSectionsSchema>;
export type ResumeMeta = z.infer<typeof resumeMetaSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type BackupFile = z.infer<typeof backupSchema>;

/** Union of every section key. */
export type SectionKey = (typeof SECTION_KEYS)[number];

/** Section keys whose value is a flat array of items (everything except `custom`). */
export type ArraySectionKey = (typeof ARRAY_SECTION_KEYS)[number];

/** Maps an array-section key to its item type. */
export interface ArraySectionItemMap {
  experience: ExperienceItem;
  education: EducationItem;
  skills: SkillGroup;
  projects: ProjectItem;
  certifications: CertificationItem;
  languages: LanguageItem;
  references: ReferenceItem;
}

/** The item type stored in a given array section. */
export type ArraySectionItem<K extends ArraySectionKey> = ArraySectionItemMap[K];

/** Input accepted when creating a resume — everything is optional. */
export interface CreateResumeInput {
  title?: string;
  basics?: Partial<Basics>;
  templateId?: string;
  locale?: string;
}

/** How an imported backup is applied to existing data. */
export type ImportMode = 'replace' | 'merge';
