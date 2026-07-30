'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

/** Route-level error boundary. Catches render errors and offers a retry. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');
  return (
    <Container className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground">{t('body')}</p>
      <Button onClick={reset} className="mt-2">
        {t('retry')}
      </Button>
    </Container>
  );
}
