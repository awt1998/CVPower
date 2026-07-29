'use client';

import * as React from 'react';
import { Plus, Copy, Trash2, FileText, BarChart3, Eye } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { analyzeResume } from '@/features/scoring';
import { useResumeStore } from '../store';
import type { Resume } from '../types';

function scoreVariant(score: number): BadgeProps['variant'] {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'destructive';
}

function ResumeCard({
  resume,
  onOpen,
  onDuplicate,
  onRequestDelete,
}: {
  resume: Resume;
  onOpen: (path: string) => void;
  onDuplicate: () => void;
  onRequestDelete: () => void;
}) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const score = React.useMemo(() => analyzeResume(resume).score.overall, [resume]);
  const updated = new Date(resume.meta.updatedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="truncate text-base">{resume.meta.title || t('untitled')}</CardTitle>
          <Badge variant={scoreVariant(score)} title={t('scoreLabel')}>
            {score}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{t('updated', { date: updated })}</p>
      </CardHeader>
      <CardContent className="mt-auto grid gap-2">
        <Button onClick={() => onOpen('/builder')}>
          <FileText className="size-4" />
          {t('open')}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpen('/analyze')}>
            <BarChart3 className="size-4" />
            {t('analyze')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpen('/preview')}>
            <Eye className="size-4" />
            {t('preview')}
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="size-4" />
            {t('duplicate')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRequestDelete}
          >
            <Trash2 className="size-4" />
            {t('delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardShell() {
  const mounted = useMounted();
  const t = useTranslations('dashboard');
  const router = useRouter();
  const order = useResumeStore((s) => s.order);
  const resumes = useResumeStore((s) => s.resumes);
  const [toDelete, setToDelete] = React.useState<string | null>(null);

  const list = React.useMemo(
    () => order.map((id) => resumes[id]).filter((r): r is Resume => Boolean(r)),
    [order, resumes],
  );

  const openIn = (id: string, path: string) => {
    useResumeStore.getState().setActiveResume(id);
    router.push(path);
  };

  const createAndOpen = () => {
    const id = useResumeStore.getState().createResume();
    openIn(id, '/builder');
  };

  if (!mounted) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t('count', { count: list.length })}</p>
        <Button onClick={createAndOpen}>
          <Plus className="size-4" />
          {t('new')}
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t('empty')}</p>
          <Button className="mt-4" onClick={createAndOpen}>
            <Plus className="size-4" />
            {t('new')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onOpen={(path) => openIn(resume.id, path)}
              onDuplicate={() => useResumeStore.getState().duplicateResume(resume.id)}
              onRequestDelete={() => setToDelete(resume.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('confirmBody', {
                title: toDelete ? (resumes[toDelete]?.meta.title ?? '') : '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (toDelete) useResumeStore.getState().deleteResume(toDelete);
                setToDelete(null);
              }}
            >
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
