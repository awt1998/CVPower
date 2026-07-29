import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  ShieldCheck,
  Gauge,
  FileCheck2,
  Target,
  Sparkles,
  Mail,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PrivacyBadge } from '@/components/brand/privacy-badge';
import { Link } from '@/i18n/navigation';

const FEATURES = [
  { key: 'privacy', icon: ShieldCheck },
  { key: 'scoring', icon: Gauge },
  { key: 'ats', icon: FileCheck2 },
  { key: 'matching', icon: Target },
  { key: 'bullets', icon: Sparkles },
  { key: 'cover', icon: Mail },
] as const;

const STEPS = ['build', 'analyze', 'improve', 'export'] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations('home');

  return (
    <>
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <Container className="flex flex-col items-center gap-6 py-24 text-center md:py-32">
          <PrivacyBadge />
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            {t('heroSubtitle')}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                {t('ctaPrimary')}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/analyze">{t('ctaSecondary')}</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t('featuresTitle')}
            </h2>
            <p className="mt-2 text-muted-foreground">{t('featuresSubtitle')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, icon: Icon }) => (
              <Card key={key} className="shadow-soft">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{t(`features.${key}.title`)}</CardTitle>
                  <CardDescription>{t(`features.${key}.body`)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <Container className="grid gap-10">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            {t('howTitle')}
          </h2>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step} className="grid gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="font-medium">{t(`steps.${step}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`steps.${step}.body`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-24">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight md:text-4xl">
            {t('ctaTitle')}
          </h2>
          <p className="max-w-xl text-balance text-muted-foreground">{t('ctaBody')}</p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/dashboard">
              {t('ctaButton')}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
