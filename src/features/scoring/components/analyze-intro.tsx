'use client';

import { Info, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Collapsible explainer describing what the analysis tool does and how to use it. */
export function AnalyzeIntro() {
  const t = useTranslations('analyze.help');
  const points = [t('point1'), t('point2'), t('point3'), t('point4')];
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <details open className="rounded-lg border bg-muted/40 p-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
        <Info className="size-4 text-primary" />
        {t('title')}
      </summary>

      <div className="mt-3 grid gap-4 text-sm text-muted-foreground">
        <p>{t('body')}</p>

        <div className="grid gap-1.5">
          <p className="font-medium text-foreground">{t('whatTitle')}</p>
          <ul className="ms-5 grid list-disc gap-1">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-1.5">
          <p className="font-medium text-foreground">{t('howTitle')}</p>
          <ol className="ms-5 grid list-decimal gap-1">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <p className="flex items-center gap-1.5 text-xs">
          <ShieldCheck className="size-3.5 shrink-0 text-success" />
          {t('privacy')}
        </p>
      </div>
    </details>
  );
}
