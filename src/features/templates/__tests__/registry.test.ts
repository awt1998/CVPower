import { describe, it, expect } from 'vitest';
import {
  getTemplateTheme,
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_IDS,
  TEMPLATE_THEMES,
} from '../registry';

describe('getTemplateTheme', () => {
  it('returns the theme for a known id', () => {
    expect(getTemplateTheme('modern').id).toBe('modern');
  });

  it('falls back to the default for an unknown id', () => {
    expect(getTemplateTheme('does-not-exist').id).toBe(DEFAULT_TEMPLATE_ID);
  });

  it('falls back to the default for undefined', () => {
    expect(getTemplateTheme(undefined).id).toBe(DEFAULT_TEMPLATE_ID);
  });

  it('has a self-consistent theme for every id', () => {
    for (const id of TEMPLATE_IDS) {
      expect(TEMPLATE_THEMES[id].id).toBe(id);
    }
  });
});
