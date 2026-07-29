'use client';

import { useLocale } from 'next-intl';

import { getDirection } from '@/i18n/routing';
import { getTemplateTheme } from '../registry';
import { ResumeDocument } from '../resume-document';
import type { Resume } from '@/features/resume/types';

/** Renders the active resume on a white "sheet" using its selected template. */
export function ResumePreview({ resume }: { resume: Resume }) {
  const locale = useLocale();
  const theme = getTemplateTheme(resume.meta.templateId);

  return (
    <div
      dir={getDirection(locale)}
      className="resume-sheet mx-auto w-full max-w-[820px] rounded-lg bg-white p-10 text-neutral-800 shadow-soft"
    >
      <ResumeDocument resume={resume} theme={theme} />
    </div>
  );
}
