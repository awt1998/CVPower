'use client';

import * as React from 'react';
import { FileDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getDirection } from '@/i18n/routing';
import type { Resume } from '@/features/resume/types';
import { downloadResumeDocx } from '../export-docx';

export function DocxExportButton({ resume }: { resume: Resume }) {
  const t = useTranslations('preview');
  const tSections = useTranslations('templates.sections');
  const tTemplates = useTranslations('templates');
  const locale = useLocale();
  const [loading, setLoading] = React.useState(false);

  const onExport = async () => {
    setLoading(true);
    try {
      await downloadResumeDocx(resume, {
        locale,
        rtl: getDirection(locale) === 'rtl',
        presentLabel: tTemplates('present'),
        sectionTitles: {
          summary: tSections('summary'),
          experience: tSections('experience'),
          education: tSections('education'),
          skills: tSections('skills'),
          projects: tSections('projects'),
          certifications: tSections('certifications'),
          languages: tSections('languages'),
          references: tSections('references'),
        },
      });
      toast.success(t('docxDone'));
    } catch {
      toast.error(t('docxFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={onExport}>
      <FileDown className="size-4" />
      {t('exportDocx')}
    </Button>
  );
}
