import type { ResumeLocation } from '@/features/resume/types';

/**
 * Format a stored resume date ("YYYY", "YYYY-MM", or "YYYY-MM-DD") into a
 * localized "Mon YYYY" (or "YYYY") label. Unrecognized values pass through.
 */
export function formatResumeDate(value: string | undefined, locale: string): string {
  if (!value) return '';
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value.trim());
  if (!match) return value;

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : undefined;
  if (!month) return String(year);

  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date);
}

/** Build a "start – end" (or "start – Present") range from the parts. */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  current: boolean,
  locale: string,
  presentLabel: string,
): string {
  const startText = formatResumeDate(start, locale);
  const endText = current ? presentLabel : formatResumeDate(end, locale);
  if (startText && endText) return `${startText} – ${endText}`;
  return startText || endText || '';
}

/** Join the non-empty parts of a location into "City, Country". */
export function formatLocation(location: ResumeLocation | undefined): string {
  if (!location) return '';
  return [location.city, location.region, location.country]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(', ');
}

/** Drop empty strings and join with a separator (default middot). */
export function joinParts(parts: (string | undefined)[], separator = ' · '): string {
  return parts.map((p) => p?.trim()).filter((p): p is string => Boolean(p)).join(separator);
}
