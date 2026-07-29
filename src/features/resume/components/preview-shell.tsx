'use client';

import * as React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { ResumePreview, TemplatePicker } from '@/features/templates';
import { printResume } from '@/features/pdf';
import { useResumeStore } from '../store';
import { useActiveResume } from './hooks/use-active-resume';

export function PreviewShell() {
  const mounted = useMounted();
  const t = useTranslations('preview');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useActiveResume();

  // If resumes exist but none is active, activate the first one.
  React.useEffect(() => {
    if (!mounted) return;
    const store = useResumeStore.getState();
    if (!store.activeResumeId && store.order.length > 0) {
      store.setActiveResume(store.order[0] ?? null);
    }
  }, [mounted, order.length, activeId]);

  if (!mounted) {
    return <Skeleton className="mx-auto h-[70vh] w-full max-w-[820px]" />;
  }

  if (!resume) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-4">
          <Link href="/builder">{t('goToBuilder')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href="/builder">
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t('backToBuilder')}
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <TemplatePicker resume={resume} />
          <Button size="sm" onClick={() => printResume(resume.meta.title)}>
            <Printer className="size-4" />
            {t('export')}
          </Button>
        </div>
      </div>

      <ResumePreview resume={resume} />
    </div>
  );
}
