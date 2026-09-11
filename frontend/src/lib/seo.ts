import type { Metadata, MetadataRoute } from 'next';
import { cache } from 'react';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from './utils';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kuhlturm.com').replace(/\/$/, '');
export type SeoRecord = { id: string; slug: string; locale?: string; updated_at?: string; created_at?: string; is_active?: boolean | number; is_published?: boolean | number; module_key?: string };
const sources: Record<string, { endpoint: string; params?: Record<string, string> }> = {
  product: { endpoint: '/products', params: { item_type: 'product', is_active: '1' } },
  sparepart: { endpoint: '/products', params: { item_type: 'sparepart', is_active: '1' } },
  service: { endpoint: '/services', params: { is_active: '1' } },
  projects: { endpoint: '/projects', params: { is_published: '1' } },
  references: { endpoint: '/references', params: { is_published: '1' } },
  library: { endpoint: '/library', params: { is_active: '1', is_published: '1' } },
  ...Object.fromEntries(['about', 'solutions', 'news', 'blog', 'team', 'legal'].map(section => [section, {
    endpoint: '/custom-pages', params: { ...(section === 'about' ? {} : { module_key: section }), is_published: '1' },
  }])),
};
export const getSeoRecords = cache(async (section: string, locale: string): Promise<SeoRecord[]> => {
  const source = sources[section];
  if (!source) return [];
  const records: SeoRecord[] = [];
  const seen = new Set<string>();
  for (let offset = 0; offset < 10000; offset += 200) {
    const query = new URLSearchParams({ ...source.params, locale, language: locale, limit: '200', offset: String(offset) });
    const response = await fetch(`${API_BASE_URL}${source.endpoint}?${query}`, {
      headers: { 'x-locale': locale, 'accept-language': locale }, next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`SEO inventory: ${section}/${locale} returned ${response.status}`);
    const data = await response.json();
    const rows: SeoRecord[] = Array.isArray(data) ? data : data.data;
    if (!Array.isArray(rows)) throw new Error(`Invalid SEO inventory: ${section}/${locale}`);
    const previousCount = seen.size;
    for (const row of rows) {
      if (!row.id || !row.slug || seen.has(row.id)) continue;
      seen.add(row.id);
      if (row.locale && row.locale !== locale) continue;
      if (section === 'about' && !['about', 'mission', 'vision', 'quality'].includes(row.module_key || '')) continue;
      if (row.is_active === 0 || row.is_active === false || row.is_published === 0 || row.is_published === false) continue;
      records.push(row);
    }
    if (rows.length < 200) return records;
    // Prevent a backend ignoring offset from silently creating an incomplete sitemap.
    if (offset > 0 && seen.size === previousCount) {
      throw new Error(`SEO inventory pagination did not advance: ${section}/${locale}`);
    }
  }
  throw new Error(`SEO inventory exceeded pagination limit: ${section}/${locale}`);
});
export function pageUrl(locale: string, path: string) { return `${SITE_URL}/${locale}${path}`; }
export async function routeAlternates(locale: string, path: string): Promise<Metadata['alternates']> {
  const [section, slug] = path.replace(/^\//, '').split('/');
  const languages: Record<string, string> = {};
  if (section && slug && sources[section]) {
    const current = (await getSeoRecords(section, locale)).find(row => row.slug === slug);
    if (current) await Promise.all(AVAILABLE_LOCALES.map(async other => {
      const match = (await getSeoRecords(section, other)).find(row => row.id === current.id);
      if (match) languages[other] = pageUrl(other, `/${section}/${match.slug}`);
    }));
  } else {
    for (const other of AVAILABLE_LOCALES) languages[other] = pageUrl(other, path);
  }
  return { canonical: pageUrl(locale, path), ...(Object.keys(languages).length ? { languages } : {}) };
}
export async function withRouteMetadata(metadata: Metadata, locale: string, path: string): Promise<Metadata> {
  const alternates = await routeAlternates(locale, path);
  return { ...metadata, alternates, openGraph: { ...metadata.openGraph, url: pageUrl(locale, path), locale: locale === 'de' ? 'de_DE' : 'en_GB' } };
}
export async function detailSitemap(section: string): Promise<MetadataRoute.Sitemap> {
  const translations = await Promise.all(AVAILABLE_LOCALES.map(async locale => ({ locale, records: await getSeoRecords(section, locale) })));
  return translations.flatMap(({ locale, records }) => records.map(row => {
    const rawDate = row.updated_at || row.created_at;
    const date = rawDate ? new Date(rawDate) : undefined;
    const languages = Object.fromEntries(translations.flatMap(other => {
      const translated = other.records.find(item => item.id === row.id);
      return translated ? [[other.locale, pageUrl(other.locale, `/${section}/${translated.slug}`)]] : [];
    }));
    return { url: pageUrl(locale, `/${section}/${row.slug}`), ...(date && !Number.isNaN(date.getTime()) ? { lastModified: date } : {}), alternates: { languages }, changeFrequency: 'monthly' as const, priority: 0.7 };
  }));
}
export const DETAIL_SECTIONS = Object.keys(sources);
