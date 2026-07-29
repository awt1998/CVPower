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

/** A fully-populated example resume for first-time users to explore. */
export function createSampleResume(): Resume {
  const resume = createResume({ title: 'Example resume' });
  resume.basics = {
    fullName: 'Alex Morgan',
    headline: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 555 0100',
    location: { city: 'Austin', country: 'USA' },
    website: 'https://alexmorgan.design',
    summary:
      'Senior product designer with 8+ years crafting user-centered digital products. Led cross-functional teams to ship features that lifted engagement and revenue, blending research, systems thinking, and polished UI.',
    links: [createLink({ label: 'LinkedIn', url: 'https://linkedin.com/in/alexmorgan' })],
  };
  resume.sections.experience = [
    createExperience({
      company: 'Northwind',
      role: 'Senior Product Designer',
      location: 'Austin, USA',
      startDate: '2021-03',
      current: true,
      summary: 'Own the design of the core product experience.',
      highlights: [
        'Redesigned onboarding, increasing activation by 24% in one quarter',
        'Built and maintained the design system used by 12 engineers',
        'Ran usability testing that cut support tickets by 18%',
      ],
      technologies: ['Figma', 'React', 'Accessibility'],
    }),
    createExperience({
      company: 'BrightApps',
      role: 'Product Designer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      highlights: [
        'Shipped a checkout redesign that raised conversion by 12%',
        'Partnered with PMs to define and validate three major features',
      ],
    }),
  ];
  resume.sections.education = [
    createEducation({
      institution: 'University of Texas',
      degree: 'B.A. Design',
      field: 'Interaction Design',
      startDate: '2012-09',
      endDate: '2016-06',
      current: false,
    }),
  ];
  resume.sections.skills = [
    createSkillGroup({ category: 'Design', items: ['UI/UX', 'Design Systems', 'Prototyping', 'User Research'] }),
    createSkillGroup({ category: 'Tools', items: ['Figma', 'React', 'HTML', 'CSS'] }),
  ];
  resume.sections.projects = [
    createProject({
      name: 'Open Design Kit',
      description: 'An open-source component library.',
      url: 'https://github.com/example/kit',
      highlights: ['1.2k GitHub stars', 'Used by 30+ teams'],
    }),
  ];
  resume.sections.languages = [
    createLanguage({ name: 'English', proficiency: 'native' }),
    createLanguage({ name: 'Spanish', proficiency: 'professional' }),
  ];
  return resume;
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
