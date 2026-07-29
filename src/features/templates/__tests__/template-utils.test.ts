import { describe, it, expect } from 'vitest';
import {
  formatResumeDate,
  formatDateRange,
  formatLocation,
  joinParts,
} from '../template-utils';

describe('formatResumeDate', () => {
  it('formats a YYYY-MM value with month and year', () => {
    expect(formatResumeDate('2023-06', 'en-US')).toMatch(/2023/);
  });

  it('returns just the year for a YYYY value', () => {
    expect(formatResumeDate('2020', 'en-US')).toBe('2020');
  });

  it('returns empty for an empty value', () => {
    expect(formatResumeDate('', 'en-US')).toBe('');
  });
});

describe('formatDateRange', () => {
  it('uses the present label when current', () => {
    expect(formatDateRange('2020', undefined, true, 'en-US', 'Present')).toBe('2020 – Present');
  });

  it('joins start and end', () => {
    expect(formatDateRange('2019', '2021', false, 'en-US', 'Present')).toBe('2019 – 2021');
  });

  it('returns a single side when the other is missing', () => {
    expect(formatDateRange('2019', undefined, false, 'en-US', 'Present')).toBe('2019');
  });
});

describe('formatLocation', () => {
  it('joins the non-empty parts', () => {
    expect(formatLocation({ city: 'Riyadh', country: 'SA' })).toBe('Riyadh, SA');
  });

  it('returns empty for undefined', () => {
    expect(formatLocation(undefined)).toBe('');
  });
});

describe('joinParts', () => {
  it('drops empty values', () => {
    expect(joinParts(['a', '', undefined, 'b'])).toBe('a · b');
  });
});
