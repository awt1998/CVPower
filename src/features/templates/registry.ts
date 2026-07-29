import type {
  AccentKey,
  AccentStyle,
  Density,
  HeaderAlign,
  PageSize,
  TemplateId,
  TemplateTheme,
} from './types';

/** Default template applied to new resumes. */
export const DEFAULT_TEMPLATE_ID: TemplateId = 'classic';
export const DEFAULT_DENSITY: Density = 'comfortable';
export const DEFAULT_HEADER_ALIGN: HeaderAlign = 'center';
export const DEFAULT_PAGE_SIZE: PageSize = 'a4';

/** Ordered list of selectable template ids. */
export const TEMPLATE_IDS: TemplateId[] = ['classic', 'modern', 'minimal'];

/**
 * Template themes. All are single-column and ATS-safe by construction; they differ
 * only in typography and heading style. Color/spacing are applied on top from the
 * user's accent + density choices.
 */
export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  classic: {
    id: 'classic',
    fontClass: 'font-serif',
    nameSizeClass: 'text-3xl',
    headingWeightClass: 'font-bold',
    headingBorderClass: 'border-b',
    defaultAccent: 'slate',
  },
  modern: {
    id: 'modern',
    fontClass: 'font-sans',
    nameSizeClass: 'text-3xl',
    headingWeightClass: 'font-semibold',
    headingBorderClass: 'border-b-2',
    defaultAccent: 'indigo',
  },
  minimal: {
    id: 'minimal',
    fontClass: 'font-sans',
    nameSizeClass: 'text-2xl',
    headingWeightClass: 'font-semibold',
    headingBorderClass: '',
    defaultAccent: 'slate',
  },
};

/** Accent palette. Static classes so Tailwind can see them at build time. */
export const ACCENTS: Record<AccentKey, AccentStyle> = {
  slate: { color: 'text-neutral-900', border: 'border-neutral-300', dot: 'bg-neutral-800' },
  indigo: { color: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-600' },
  emerald: { color: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600' },
  rose: { color: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-600' },
  amber: { color: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  sky: { color: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-600' },
};

export const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[];

/** Resolve a (possibly missing/unknown) template id to a concrete theme. */
export function getTemplateTheme(id: string | undefined): TemplateTheme {
  if (id && Object.prototype.hasOwnProperty.call(TEMPLATE_THEMES, id)) {
    return TEMPLATE_THEMES[id as TemplateId];
  }
  return TEMPLATE_THEMES[DEFAULT_TEMPLATE_ID];
}

/** Resolve an accent key to its style, falling back to the theme's default. */
export function getAccent(key: string | undefined, fallback: AccentKey): AccentStyle {
  if (key && Object.prototype.hasOwnProperty.call(ACCENTS, key)) {
    return ACCENTS[key as AccentKey];
  }
  return ACCENTS[fallback];
}
