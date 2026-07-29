'use client';

import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ResumePreview } from '@/features/templates';
import { useActiveResume } from './hooks/use-active-resume';

function PreviewInner() {
  const t = useTranslations('livePreview');
  const resume = useActiveResume();
  if (!resume) return <p className="text-sm text-muted-foreground">{t('empty')}</p>;
  return <ResumePreview resume={resume} />;
}

/**
 * Live resume preview: renders the actual resume with the selected template and
 * updates in real time as the user edits — so every section and addition shows
 * exactly where it lands on the page. Sticky beside the editor on wide screens,
 * a slide-up sheet on smaller ones.
 */
export function LivePreviewPanel() {
  const t = useTranslations('livePreview');

  return (
    <>
      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <p className="mb-2 text-sm font-semibold">{t('title')}</p>
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-xl border bg-muted/30 p-3">
            <PreviewInner />
          </div>
        </div>
      </aside>

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="fixed bottom-4 end-4 z-30 shadow-soft print:hidden"
            >
              <Eye className="size-4" />
              {t('title')}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('title')}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 pb-6">
              <PreviewInner />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
