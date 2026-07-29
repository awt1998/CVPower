import type { Resume } from '@/features/resume/types';

/** Available resume templates. Add an id here and a theme in `registry.ts`. */
export type TemplateId = 'classic' | 'modern';

/**
 * A template is a set of style choices layered over one shared, ATS-safe,
 * single-column document renderer. Keeping layout shared guarantees every
 * template stays machine-parseable; only presentation changes.
 */
export interface TemplateTheme {
  id: TemplateId;
  /** Font family class applied to the whole sheet. */
  fontClass: string;
  /** Candidate name styling (size, weight, accent color). */
  nameClass: string;
  /** Section heading styling (color + rule under the heading). */
  headingClass: string;
  /** Accent used for links and small emphasis. */
  accentClass: string;
}

export interface ResumeDocumentProps {
  resume: Resume;
  theme: TemplateTheme;
}
