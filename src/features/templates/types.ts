import type { Resume } from '@/features/resume/types';

/** Available resume templates. Add an id here and a theme in `registry.ts`. */
export type TemplateId = 'classic' | 'modern' | 'minimal';

/** Accent colors a user can pick, independent of the template. */
export type AccentKey = 'slate' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky';

export type Density = 'comfortable' | 'compact';
export type HeaderAlign = 'center' | 'start';
export type PageSize = 'a4' | 'letter';

/**
 * A template controls structure/typography; color comes from the chosen accent,
 * and spacing from the chosen density. Keeping these orthogonal lets one template
 * produce many looks while staying single-column and ATS-safe.
 */
export interface TemplateTheme {
  id: TemplateId;
  fontClass: string;
  nameSizeClass: string;
  headingWeightClass: string;
  /** '' | 'border-b' | 'border-b-2' — the section-heading underline style. */
  headingBorderClass: string;
  defaultAccent: AccentKey;
}

export interface AccentStyle {
  /** Tailwind text color class. */
  color: string;
  /** Tailwind border color class (for heading underlines). */
  border: string;
  /** Tailwind bg color class (for the swatch dot). */
  dot: string;
}

export interface ResumeDocumentProps {
  resume: Resume;
  theme: TemplateTheme;
}
