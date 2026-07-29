'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '../store';
import { useActiveResume } from './hooks/use-active-resume';
import { ResumeSwitcher } from './parts/resume-switcher';
import { ImportExport } from './parts/import-export';
import { AutosaveIndicator } from './parts/autosave-indicator';
import { Stepper } from './parts/stepper';
import { BUILDER_STEPS, isStepComplete } from './steps';

function BuilderSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="grid content-start gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="grid content-start gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export function BuilderShell() {
  const mounted = useMounted();
  const t = useTranslations('builder');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useActiveResume();
  const [stepIndex, setStepIndex] = React.useState(0);

  // Ensure there is always exactly one active resume to edit.
  React.useEffect(() => {
    if (!mounted) return;
    const store = useResumeStore.getState();
    if (store.order.length === 0) {
      store.createResume();
    } else if (!store.activeResumeId) {
      store.setActiveResume(store.order[0] ?? null);
    }
  }, [mounted, order.length, activeId]);

  if (!mounted || !resume) return <BuilderSkeleton />;

  const steps = BUILDER_STEPS.map((step) => ({ id: step.id, label: t(`steps.${step.id}`) }));
  const completed: Record<string, boolean> = {};
  for (const step of BUILDER_STEPS) completed[step.id] = isStepComplete(resume, step.id);

  const currentStep = BUILDER_STEPS[stepIndex] ?? BUILDER_STEPS[0]!;
  const StepComponent = currentStep.Component;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === BUILDER_STEPS.length - 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="grid content-start gap-6">
        <ResumeSwitcher />
        <ImportExport />
        <Separator />
        <Stepper
          steps={steps}
          currentIndex={stepIndex}
          completed={completed}
          onSelect={setStepIndex}
          ariaLabel={t('stepsNav')}
        />
      </aside>

      <section className="grid content-start gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{t(`steps.${currentStep.id}`)}</h2>
          <div className="flex items-center gap-3">
            <AutosaveIndicator updatedAt={resume.meta.updatedAt} />
            <Button asChild variant="outline" size="sm">
              <Link href="/preview">
                <Eye className="size-4" />
                {t('preview')}
              </Link>
            </Button>
          </div>
        </div>

        <StepComponent resume={resume} />

        <div className="flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={isFirst}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            {t('prev')}
          </Button>
          {isLast ? (
            <Button asChild>
              <Link href="/preview">
                <Eye className="size-4" />
                {t('preview')}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setStepIndex((i) => Math.min(BUILDER_STEPS.length - 1, i + 1))}
            >
              {t('next')}
              <ChevronRight className="size-4 rtl:rotate-180" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
