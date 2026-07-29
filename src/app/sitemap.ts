import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

const PATHS = ['', '/dashboard', '/builder', '/analyze', '/preview', '/cover-letter'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of PATHS) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.7,
      });
    }
  }
  return entries;
}
