import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { ProgressShell } from '@/features/analytics';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'progress' });
  return { title: t('title') };
}

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'progress' });

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>
      <ProgressShell />
    </Container>
  );
}
