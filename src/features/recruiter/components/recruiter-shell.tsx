'use client';

import * as React from 'react';
import { Monitor, Tablet, Smartphone, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { escapeRegExp } from '@/lib/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import { useJobStore } from '@/features/matching/store';
import { ResumeSelect } from '@/features/resume/components/parts/resume-select';
import { extractResumeText, extractSkills, CANONICAL_TO_ENTRY } from '@/features/matching';
import { analyzeAts, resumeHealth, readingTimeSeconds } from '@/features/scoring';
import type { Resume } from '@/features/resume/types';

type Device = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTH: Record<Device, string> = {
  desktop: 'max-w-none',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[420px]',
};

const SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'references',
] as const;
type SectionId = (typeof SECTION_IDS)[number];

function sectionDone(resume: Resume, id: SectionId): boolean {
  if (id === 'summary') return Boolean(resume.basics.summary?.trim());
  return resume.sections[id].length > 0;
}

function highlight(text: string, termSet: Set<string>, terms: string[]): React.ReactNode[] {
  if (terms.length === 0) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(pattern).map((part, index) =>
    termSet.has(part.toLowerCase()) ? (
      <mark key={index} className="rounded bg-warning/30 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

export function RecruiterShell() {
  const mounted = useMounted();
  const t = useTranslations('recruiter');
  const tSteps = useTranslations('builder.steps');
  const tReasons = useTranslations('analyze.reasons');
  const tMetrics = useTranslations('health.metrics');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId] ?? null) : null,
  );
  const jobText = useJobStore((s) => s.jobText);
  const [device, setDevice] = React.useState<Device>('desktop');

  React.useEffect(() => {
    if (!mounted) return;
    const store = useResumeStore.getState();
    if (!store.activeResumeId && store.order.length > 0) {
      store.setActiveResume(store.order[0] ?? null);
    }
  }, [mounted, order.length, activeId]);

  const data = React.useMemo(() => {
    if (!resume) return null;
    const text = extractResumeText(resume);
    const detected = extractSkills(text);
    const terms = detected.flatMap((d) => {
      const entry = CANONICAL_TO_ENTRY.get(d.canonical.toLowerCase());
      return entry ? [entry.canonical, ...entry.aliases] : [d.canonical];
    });
    const termSet = new Set(terms.map((x) => x.toLowerCase()));
    const issues = analyzeAts(resume).checks.filter((c) => !c.ok);
    const health = resumeHealth(resume, jobText);
    return {
      text,
      keywords: detected.map((d) => d.canonical),
      terms,
      termSet,
      issues,
      scanTime: readingTimeSeconds(resume),
      sections: SECTION_IDS.filter((id) => sectionDone(resume, id)),
      strengths: health.metrics.filter((m) => m.status === 'green').map((m) => m.id),
      weak: health.metrics.filter((m) => m.status === 'red').map((m) => m.id),
    };
  }, [resume, jobText]);

  if (!mounted) return <Skeleton className="h-[60vh] w-full" />;

  if (!resume || !data) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-4">
          <Link href="/builder">{t('goToBuilder')}</Link>
        </Button>
      </div>
    );
  }

  const deviceButtons: { id: Device; icon: typeof Monitor }[] = [
    { id: 'desktop', icon: Monitor },
    { id: 'tablet', icon: Tablet },
    { id: 'mobile', icon: Smartphone },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-sm flex-1">
          <ResumeSelect />
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {deviceButtons.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              variant={device === id ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8"
              aria-label={t(`device.${id}`)}
              aria-pressed={device === id}
              onClick={() => setDevice(id)}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <GlassCard className="overflow-hidden p-0">
          <div className="border-b px-5 py-3">
            <p className="text-sm font-semibold">{t('parsedTitle')}</p>
            <p className="text-xs text-muted-foreground">{t('scanTime', { seconds: data.scanTime })}</p>
          </div>
          <div className="p-5">
            <div className={cn('mx-auto whitespace-pre-wrap font-mono text-sm leading-relaxed', DEVICE_WIDTH[device])}>
              {highlight(data.text, data.termSet, data.terms)}
            </div>
          </div>
        </GlassCard>

        <div className="grid content-start gap-6">
          <GlassCard className="grid gap-2 p-5">
            <h3 className="text-sm font-semibold">{t('sectionOrder')}</h3>
            <ol className="grid gap-1 text-sm text-muted-foreground">
              {data.sections.map((id, i) => (
                <li key={id}>
                  {i + 1}. {tSteps(id)}
                </li>
              ))}
            </ol>
          </GlassCard>

          <GlassCard className="grid gap-2 p-5">
            <h3 className="text-sm font-semibold">{t('keywords')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.keywords.length > 0 ? (
                data.keywords.map((k) => (
                  <Badge key={k} variant="secondary" className="font-normal">
                    {k}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('none')}</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="grid gap-2 p-5">
            <h3 className="text-sm font-semibold">{t('issues')}</h3>
            {data.issues.length > 0 ? (
              <ul className="grid gap-1 text-sm">
                {data.issues.map((c) => (
                  <li key={c.id} className="flex items-start gap-2 text-muted-foreground">
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                    {tReasons(c.code)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 text-sm text-success">
                <Check className="size-4" />
                {t('noIssues')}
              </p>
            )}
          </GlassCard>

          <GlassCard className="grid gap-3 p-5">
            <div>
              <h3 className="mb-1 text-sm font-semibold text-success">{t('strengths')}</h3>
              <p className="text-sm text-muted-foreground">
                {data.strengths.length > 0
                  ? data.strengths.map((id) => tMetrics(`${id}.label`)).join(' · ')
                  : t('none')}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold text-destructive">{t('weak')}</h3>
              <p className="text-sm text-muted-foreground">
                {data.weak.length > 0
                  ? data.weak.map((id) => tMetrics(`${id}.label`)).join(' · ')
                  : t('none')}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
