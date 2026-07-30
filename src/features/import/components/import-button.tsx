'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { useResumeStore } from '@/features/resume/store';
import { readResumeFile } from '../read';
import { buildResumeFromText } from '../parse';

/** Import an existing resume (PDF/DOCX/TXT) into a new, editable CVPower resume. */
export function ImportButton() {
  const t = useTranslations('import');
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLoading(true);
    try {
      const text = await readResumeFile(file);
      const resume = buildResumeFromText(text);
      useResumeStore.getState().addResume(resume);
      toast.success(t('done'));
      router.push('/builder');
    } catch {
      toast.error(t('failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" disabled={loading} onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" />
        {loading ? t('loading') : t('cta')}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={onFile}
      />
    </>
  );
}
