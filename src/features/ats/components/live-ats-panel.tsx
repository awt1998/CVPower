'use client';

import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LiveAtsContent } from './live-ats-content';

/** Live ATS preview: a sticky panel on desktop, a slide-up sheet on mobile/tablet. */
export function LiveAtsPanel() {
  const t = useTranslations('liveAts');

  return (
    <>
      <aside className="hidden xl:block">
        <GlassCard className="sticky top-20 p-5">
          <h3 className="mb-4 text-sm font-semibold">{t('title')}</h3>
          <LiveAtsContent />
        </GlassCard>
      </aside>

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="fixed bottom-4 end-4 z-30 shadow-soft print:hidden"
            >
              <Activity className="size-4" />
              {t('title')}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('title')}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 pb-6">
              <LiveAtsContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
