import type { Product } from '@ensotek/core/types';
import { StructuredData } from './StructuredData';
import { SITE_URL } from '@/lib/seo';
import { resolveMediaUrl } from '@/lib/media';

export function ProductStructuredData({ item, locale, section }: { item: Product; locale: string; section: 'product' | 'sparepart' }) {
  const url = `${SITE_URL}/${locale}/${section}/${encodeURIComponent(item.slug)}`;
  const images = [...new Set([item.image_url, ...(Array.isArray(item.images) ? item.images : [])].filter((x): x is string => !!x))]
    .map(src => new URL(resolveMediaUrl(src), SITE_URL).href);
  return <StructuredData data={{ '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`, url,
    name: item.title, description: item.description?.replace(/<[^>]*>/g, '').trim() || undefined,
    sku: item.product_code || undefined, image: images.length ? images : undefined,
    brand: { '@type': 'Brand', name: 'Ensotek' }, manufacturer: { '@id': `${SITE_URL}/#organization` },
  }} />;
}
