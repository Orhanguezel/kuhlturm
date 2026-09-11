import type { MetadataRoute } from 'next';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { DETAIL_SECTIONS, detailSitemap, pageUrl } from '@/lib/seo';

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '',             priority: 1.0, changeFreq: 'daily'   },
  { path: '/about',       priority: 0.8, changeFreq: 'weekly'  },
  { path: '/service',     priority: 0.9, changeFreq: 'weekly'  },
  { path: '/product',     priority: 0.9, changeFreq: 'weekly'  },
  { path: '/projects',    priority: 0.8, changeFreq: 'weekly'  },
  { path: '/solutions',   priority: 0.7, changeFreq: 'weekly'  },
  { path: '/references',  priority: 0.7, changeFreq: 'weekly'  },
  { path: '/library',     priority: 0.7, changeFreq: 'weekly'  },
  { path: '/news',        priority: 0.7, changeFreq: 'weekly'  },
  { path: '/blog',        priority: 0.7, changeFreq: 'weekly'  },
  { path: '/sparepart',   priority: 0.7, changeFreq: 'weekly'  },
  { path: '/contact',     priority: 0.8, changeFreq: 'monthly' },
  { path: '/offer',       priority: 0.7, changeFreq: 'monthly' },
  { path: '/team',        priority: 0.6, changeFreq: 'monthly' },
  { path: '/faqs',        priority: 0.6, changeFreq: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const details = await Promise.all(DETAIL_SECTIONS.map(detailSitemap));
  const staticEntries: MetadataRoute.Sitemap = AVAILABLE_LOCALES.flatMap(locale => STATIC_ROUTES.map(route => ({
    url: pageUrl(locale, route.path), changeFrequency: route.changeFreq, priority: route.priority,
    alternates: { languages: Object.fromEntries(AVAILABLE_LOCALES.map(other => [other, pageUrl(other, route.path)])) },
  })));
  return [...staticEntries, ...details.flat()];
}
