import type { ComponentType } from 'react';
import type { Resume } from '../../types';
import { PersonalInfoStep } from './personal-info-step';
import { SummaryStep } from './summary-step';
import { ExperienceStep } from './experience-step';
import { EducationStep } from './education-step';
import { SkillsStep } from './skills-step';
import { LanguagesStep } from './languages-step';
import { CertificationsStep } from './certifications-step';
import { ProjectsStep } from './projects-step';
import { ReferencesStep } from './references-step';

export type StepId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'references';

export interface BuilderStep {
  id: StepId;
  Component: ComponentType<{ resume: Resume }>;
}

/** Ordered steps of the resume builder. */
export const BUILDER_STEPS: BuilderStep[] = [
  { id: 'personal', Component: PersonalInfoStep },
  { id: 'summary', Component: SummaryStep },
  { id: 'experience', Component: ExperienceStep },
  { id: 'education', Component: EducationStep },
  { id: 'skills', Component: SkillsStep },
  { id: 'languages', Component: LanguagesStep },
  { id: 'certifications', Component: CertificationsStep },
  { id: 'projects', Component: ProjectsStep },
  { id: 'references', Component: ReferencesStep },
];

/** Whether a step has any user-entered content (drives the stepper's check marks). */
export function isStepComplete(resume: Resume, id: StepId): boolean {
  switch (id) {
    case 'personal':
      return resume.basics.fullName.trim().length > 0;
    case 'summary':
      return (resume.basics.summary ?? '').trim().length > 0;
    case 'experience':
      return resume.sections.experience.length > 0;
    case 'education':
      return resume.sections.education.length > 0;
    case 'skills':
      return resume.sections.skills.length > 0;
    case 'languages':
      return resume.sections.languages.length > 0;
    case 'certifications':
      return resume.sections.certifications.length > 0;
    case 'projects':
      return resume.sections.projects.length > 0;
    case 'references':
      return resume.sections.references.length > 0;
    default:
      return false;
  }
}
