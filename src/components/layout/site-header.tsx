import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { siteConfig } from '@/config/site';

export function SiteHeader() {
  const t = useTranslations('nav');

  const links = [
    { href: '/builder', label: t('builder') },
    { href: '/analyze', label: t('analyze') },
    { href: '/templates', label: t('templates') },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label={siteConfig.name}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Button key={link.href} asChild variant="ghost" size="sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button asChild variant="ghost" size="icon" aria-label={t('github')}>
            <a href={siteConfig.repository} target="_blank" rel="noreferrer noopener">
              <Github className="size-5" />
            </a>
          </Button>
        </div>
      </Container>
    </header>
  );
}
