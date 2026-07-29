'use client';

import * as React from 'react';
import { Plus, Copy, Trash2, Pencil, GitCompare, Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import type { Resume } from '@/features/resume/types';
import { diffResumes } from '../diff';

export function VersionsShell() {
  const mounted = useMounted();
  const t = useTranslations('versions');
  const locale = useLocale();
  const order = useResumeStore((s) => s.order);
  const resumes = useResumeStore((s) => s.resumes);
  const activeId = useResumeStore((s) => s.activeResumeId);

  const [rename, setRename] = React.useState<{ id: string; value: string } | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [compareId, setCompareId] = React.useState<string | null>(null);

  const list = React.useMemo(
    () => order.map((id) => resumes[id]).filter((r): r is Resume => Boolean(r)),
    [order, resumes],
  );

  if (!mounted) return <Skeleton className="h-[60vh] w-full" />;

  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const activeResume = activeId ? (resumes[activeId] ?? null) : null;
  const compareResume = compareId ? (resumes[compareId] ?? null) : null;
  const diff = activeResume && compareResume ? diffResumes(activeResume, compareResume) : null;

  const store = () => useResumeStore.getState();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t('count', { count: list.length })}</p>
        <Button onClick={() => store().createResume()}>
          <Plus className="size-4" />
          {t('new')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((resume) => {
          const isActive = resume.id === activeId;
          return (
            <GlassCard key={resume.id} className={cn('flex flex-col gap-3 p-5', isActive && 'ring-2 ring-primary')}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-medium">{resume.meta.title || t('untitled')}</h3>
                {isActive && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    <Check className="size-3.5" />
                    {t('active')}
                  </span>
                )}
              </div>

              <dl className="grid gap-0.5 text-xs text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <dt>{t('created')}</dt>
                  <dd>{fmt(resume.meta.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>{t('modified')}</dt>
                  <dd>{fmt(resume.meta.updatedAt)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>{t('lastUsed')}</dt>
                  <dd>{fmt(resume.meta.lastUsedAt)}</dd>
                </div>
              </dl>

              <div className="mt-auto grid grid-cols-2 gap-2">
                <Button
                  variant={isActive ? 'secondary' : 'default'}
                  size="sm"
                  disabled={isActive}
                  onClick={() => {
                    store().setActiveResume(resume.id);
                    store().updateMeta(resume.id, { lastUsedAt: new Date().toISOString() });
                  }}
                >
                  {t('switch')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isActive}
                  onClick={() => setCompareId(resume.id)}
                >
                  <GitCompare className="size-4" />
                  {t('compare')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setRename({ id: resume.id, value: resume.meta.title })}>
                  <Pencil className="size-4" />
                  {t('rename')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => store().duplicateResume(resume.id)}>
                  <Copy className="size-4" />
                  {t('duplicate')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-2 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteId(resume.id)}
                >
                  <Trash2 className="size-4" />
                  {t('delete')}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {diff && compareResume && activeResume && (
        <GlassCard className="grid gap-4 p-6">
          <h2 className="text-base font-semibold">
            {t('compareTitle', { a: activeResume.meta.title || t('untitled'), b: compareResume.meta.title || t('untitled') })}
          </h2>
          <p className="text-sm text-muted-foreground">{t('shared', { count: diff.shared })}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">{t('onlyActive')}</p>
              <ul className="grid gap-1 text-sm text-muted-foreground">
                {diff.onlyA.length > 0 ? diff.onlyA.map((l, i) => <li key={i}>• {l}</li>) : <li>{t('none')}</li>}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">{t('onlyOther')}</p>
              <ul className="grid gap-1 text-sm text-muted-foreground">
                {diff.onlyB.length > 0 ? diff.onlyB.map((l, i) => <li key={i}>• {l}</li>) : <li>{t('none')}</li>}
              </ul>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Rename dialog */}
      <Dialog open={rename !== null} onOpenChange={(o) => !o && setRename(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('renameTitle')}</DialogTitle>
          </DialogHeader>
          <Input
            value={rename?.value ?? ''}
            onChange={(e) => setRename((prev) => (prev ? { ...prev, value: e.target.value } : prev))}
            aria-label={t('renameTitle')}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRename(null)}>
              {t('cancel')}
            </Button>
            <Button
              onClick={() => {
                if (rename) store().renameResume(rename.id, rename.value.trim() || t('untitled'));
                setRename(null);
              }}
            >
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t('confirmBody', { title: deleteId ? (resumes[deleteId]?.meta.title ?? '') : '' })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) {
                  store().deleteResume(deleteId);
                  if (compareId === deleteId) setCompareId(null);
                }
                setDeleteId(null);
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
