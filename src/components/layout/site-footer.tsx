import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/brand/logo';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t py-10 print:hidden">
      <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p className="text-sm text-muted-foreground">{t('builtWith')}</p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            {t('privacy')}
          </Link>
          <a
            href={`${siteConfig.repository}/tree/main/docs`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            {t('docs')}
          </a>
          <a
            href={`${siteConfig.repository}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            {t('license')}
          </a>
        </nav>
      </Container>
    </footer>
  );
}
