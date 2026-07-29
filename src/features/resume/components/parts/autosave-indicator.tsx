'use client';

import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export interface AutosaveIndicatorProps {
  updatedAt?: string;
}

/**
 * Passive "saved on your device" indicator. Edits land in the store immediately
 * and are persisted (debounced) to LocalStorage, so this reflects the last change.
 */
export function AutosaveIndicator({ updatedAt }: AutosaveIndicatorProps) {
  const t = useTranslations('builder.autosave');
  const locale = useLocale();

  const time = updatedAt
    ? new Date(updatedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Check className="size-3.5 text-success" />
      {time ? t('savedAt', { time }) : t('saved')}
    </span>
  );
}
