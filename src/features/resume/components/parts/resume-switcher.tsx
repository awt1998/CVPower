'use client';

import * as React from 'react';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResumeStore } from '../../store';
import { SelectField } from '../fields/select-field';

/** Switch between, create, duplicate, and delete resumes. */
export function ResumeSwitcher() {
  const t = useTranslations('builder.switcher');
  const order = useResumeStore((s) => s.order);
  const resumes = useResumeStore((s) => s.resumes);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const options = React.useMemo(
    () =>
      order
        .map((id) => resumes[id])
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({ value: r.id, label: r.meta.title || t('untitled') })),
    [order, resumes, t],
  );

  const activeTitle = activeId ? (resumes[activeId]?.meta.title ?? '') : '';

  return (
    <div className="grid gap-2">
      <SelectField
        label={t('label')}
        value={activeId ?? ''}
        options={options}
        onChange={(id) => useResumeStore.getState().setActiveResume(id)}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => useResumeStore.getState().createResume()}
        >
          <Plus className="size-4" />
          {t('new')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!activeId}
          onClick={() => activeId && useResumeStore.getState().duplicateResume(activeId)}
        >
          <Copy className="size-4" />
          {t('duplicate')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!activeId}
          className="text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-4" />
          {t('delete')}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmTitle')}</DialogTitle>
            <DialogDescription>{t('confirmBody', { title: activeTitle })}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (activeId) useResumeStore.getState().deleteResume(activeId);
                setConfirmOpen(false);
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
