'use client';

import * as React from 'react';
import { Download, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useResumeStore } from '../../store';
import { BackupParseError } from '../../serialization';

/** Export all resumes to a JSON file and import (merge) a backup from disk. */
export function ImportExport() {
  const t = useTranslations('builder.backup');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onExport = () => {
    const json = useResumeStore.getState().exportBackupString();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `cvpower-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success(t('exported'));
  };

  const onImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      useResumeStore.getState().importBackup(text, 'merge');
      toast.success(t('imported'));
    } catch (error) {
      const message = error instanceof BackupParseError ? t('invalid') : t('failed');
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onExport}>
        <Download className="size-4" />
        {t('export')}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" />
        {t('import')}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onImportFile}
      />
    </div>
  );
}
