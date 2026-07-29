import { z } from 'zod';
import {
  RESUME_SCHEMA_VERSION,
  BACKUP_KIND,
  LANGUAGE_PROFICIENCIES,
  SKILL_LEVELS,
} from './constants';

/**
 * Zod is the single source of truth for the resume data model. All TypeScript
 * types are inferred from these schemas (see `types.ts`) so validation and types
 * can never drift apart.
 */

const idSchema = z.string().min(1);

/** A short free-form date such as "2023", "2023-06", or "2023-06-01". */
const resumeDate = z.string().trim().max(20);

/** Optional email: a valid address or an empty string. */
const optionalEmail = z.union([z.string().email(), z.literal('')]).optional();

/** Optional URL: a valid URL or an empty string. */
const optionalUrl = z.union([z.string().url(), z.literal('')]).optional();

export const linkSchema = z.object({
  id: idSchema,
  label: z.string().trim().max(60).optional(),
  url: optionalUrl,
});

export const locationSchema = z.object({
  city: z.string().trim().max(100).optional(),
  region: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  remote: z.boolean().optional(),
});

export const basicsSchema = z.object({
  fullName: z.string().trim().max(120),
  headline: z.string().trim().max(160).optional(),
  email: optionalEmail,
  phone: z.string().trim().max(40).optional(),
  location: locationSchema.optional(),
  website: optionalUrl,
  summary: z.string().max(4000).optional(),
  links: z.array(linkSchema),
});

export const experienceSchema = z.object({
  id: idSchema,
  company: z.string().trim().max(160),
  role: z.string().trim().max(160),
  location: z.string().trim().max(160).optional(),
  startDate: resumeDate.optional(),
  endDate: resumeDate.optional(),
  current: z.boolean(),
  summary: z.string().max(2000).optional(),
  highlights: z.array(z.string().max(500)),
  technologies: z.array(z.string().trim().max(60)).optional(),
});

export const educationSchema = z.object({
  id: idSchema,
  institution: z.string().trim().max(160),
  degree: z.string().trim().max(160),
  field: z.string().trim().max(160).optional(),
  location: z.string().trim().max(160).optional(),
  startDate: resumeDate.optional(),
  endDate: resumeDate.optional(),
  current: z.boolean(),
  grade: z.string().trim().max(60).optional(),
  highlights: z.array(z.string().max(500)),
});

export const skillGroupSchema = z.object({
  id: idSchema,
  category: z.string().trim().max(80),
  level: z.enum(SKILL_LEVELS).optional(),
  items: z.array(z.string().trim().max(60)),
});

export const projectSchema = z.object({
  id: idSchema,
  name: z.string().trim().max(160),
  description: z.string().max(2000).optional(),
  url: optionalUrl,
  startDate: resumeDate.optional(),
  endDate: resumeDate.optional(),
  highlights: z.array(z.string().max(500)),
  technologies: z.array(z.string().trim().max(60)).optional(),
});

export const certificationSchema = z.object({
  id: idSchema,
  name: z.string().trim().max(160),
  issuer: z.string().trim().max(160).optional(),
  date: resumeDate.optional(),
  expiryDate: resumeDate.optional(),
  url: optionalUrl,
});

export const languageSchema = z.object({
  id: idSchema,
  name: z.string().trim().max(80),
  proficiency: z.enum(LANGUAGE_PROFICIENCIES),
});

export const referenceSchema = z.object({
  id: idSchema,
  name: z.string().trim().max(160),
  title: z.string().trim().max(160).optional(),
  company: z.string().trim().max(160).optional(),
  relationship: z.string().trim().max(160).optional(),
  email: optionalEmail,
  phone: z.string().trim().max(40).optional(),
  summary: z.string().max(1000).optional(),
});

export const customItemSchema = z.object({
  id: idSchema,
  title: z.string().trim().max(160).optional(),
  subtitle: z.string().trim().max(160).optional(),
  date: resumeDate.optional(),
  description: z.string().max(2000).optional(),
  highlights: z.array(z.string().max(500)),
});

export const customSectionSchema = z.object({
  id: idSchema,
  title: z.string().trim().max(80),
  items: z.array(customItemSchema),
});

export const resumeSectionsSchema = z.object({
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillGroupSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  references: z.array(referenceSchema),
  custom: z.array(customSectionSchema),
});

export const resumeMetaSchema = z.object({
  title: z.string().trim().max(120),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  templateId: z.string().max(80).optional(),
  locale: z.string().max(10).optional(),
  lastUsedAt: z.string().optional(),
});

export const resumeSchema = z.object({
  id: idSchema,
  schemaVersion: z.number().int().nonnegative(),
  meta: resumeMetaSchema,
  basics: basicsSchema,
  sections: resumeSectionsSchema,
});

/** The full persisted store payload. */
export const resumeDataSchema = z.object({
  schemaVersion: z.number().int().nonnegative(),
  resumes: z.record(idSchema, resumeSchema),
  order: z.array(idSchema),
  activeResumeId: idSchema.nullable(),
});

/** A portable JSON backup file. */
export const backupSchema = z.object({
  kind: z.literal(BACKUP_KIND),
  schemaVersion: z.number().int().nonnegative(),
  exportedAt: z.string().min(1),
  activeResumeId: idSchema.nullable().optional(),
  resumes: z.array(resumeSchema),
});

/** Validate an unknown value as a Resume, returning a typed result. */
export function validateResume(value: unknown) {
  return resumeSchema.safeParse(value);
}

/** Validate an unknown value as the persisted store data. */
export function validateResumeData(value: unknown) {
  return resumeDataSchema.safeParse(value);
}

/** Validate an unknown value as a backup file. */
export function validateBackup(value: unknown) {
  return backupSchema.safeParse(value);
}

export const CURRENT_BACKUP_SCHEMA_VERSION = RESUME_SCHEMA_VERSION;
