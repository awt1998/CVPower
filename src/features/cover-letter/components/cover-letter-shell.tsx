'use client';

import * as React from 'react';
import { Copy, Printer, Check, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDirection } from '@/i18n/routing';
import { useMounted } from '@/hooks/use-mounted';
import { TextField } from '@/features/resume/components/fields/text-field';
import { TextareaField } from '@/features/resume/components/fields/textarea-field';
import { useResumeStore } from '@/features/resume/store';
import { useJobStore } from '@/features/matching/store';
import { printResume } from '@/features/pdf';
import { useCoverLetterStore } from '../store';
import { assembleCoverLetter, coverChecklist } from '../assemble';

export function CoverLetterShell() {
  const mounted = useMounted();
  const t = useTranslations('cover');
  const locale = useLocale();
  const cl = useCoverLetterStore();
  const jobText = useJobStore((s) => s.jobText);
  const activeName = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId]?.basics.fullName ?? '') : '',
  );

  // Prefill the sender's name from the active resume once.
  React.useEffect(() => {
    if (!mounted) return;
    if (!useCoverLetterStore.getState().senderName && activeName) {
      useCoverLetterStore.getState().setField('senderName', activeName);
    }
  }, [mounted, activeName]);

  if (!mounted) return <Skeleton className="h-[60vh] w-full" />;

  const letter = {
    senderName: cl.senderName,
    recipientName: cl.recipientName,
    company: cl.company,
    role: cl.role,
    intro: cl.intro,
    body: cl.body,
    closing: cl.closing,
  };
  const recipient = cl.recipientName.trim() || t('greetingFallback');
  const greeting = `${t('greetingPrefix')} ${recipient},`;
  const assembled = assembleCoverLetter(letter, greeting);
  const checklist = coverChecklist(letter, jobText);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(assembled);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid content-start gap-4 print:hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={t('senderName')} value={cl.senderName} onChange={(v) => cl.setField('senderName', v)} />
          <TextField label={t('recipientName')} value={cl.recipientName} onChange={(v) => cl.setField('recipientName', v)} placeholder={t('greetingFallback')} />
          <TextField label={t('company')} value={cl.company} onChange={(v) => cl.setField('company', v)} />
          <TextField label={t('role')} value={cl.role} onChange={(v) => cl.setField('role', v)} />
        </div>
        <TextareaField label={t('intro')} value={cl.intro} onChange={(v) => cl.setField('intro', v)} rows={3} description={t('introHint')} />
        <TextareaField label={t('body')} value={cl.body} onChange={(v) => cl.setField('body', v)} rows={7} description={t('bodyHint')} />
        <TextareaField label={t('closing')} value={cl.closing} onChange={(v) => cl.setField('closing', v)} rows={2} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('checklistTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm">
              {checklist.map((check) => (
                <li key={check.id} className="flex items-center gap-2">
                  {check.ok ? (
                    <Check className="size-4 shrink-0 text-success" />
                  ) : (
                    <X className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={check.ok ? 'text-foreground' : 'text-muted-foreground'}>
                    {t(`checks.${check.id}`)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid content-start gap-4">
        <div className="flex flex-wrap justify-end gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={copy}>
            <Copy className="size-4" />
            {t('copy')}
          </Button>
          <Button size="sm" onClick={() => printResume(t('printTitle'))}>
            <Printer className="size-4" />
            {t('export')}
          </Button>
        </div>
        <div
          dir={getDirection(locale)}
          className="resume-sheet mx-auto w-full max-w-[820px] whitespace-pre-line rounded-lg bg-white p-10 leading-relaxed text-neutral-800 shadow-soft"
        >
          {assembled || <span className="text-neutral-400">{t('emptyPreview')}</span>}
        </div>
      </div>
    </div>
  );
}
