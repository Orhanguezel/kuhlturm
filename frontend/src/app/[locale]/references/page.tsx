import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { getReferences, getSubCategories } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { ReferencesGrid } from '@/components/sections/ReferencesGrid';

export const dynamic = 'force-dynamic';

const REFERENCES_CATEGORY_ID = 'aaaa5002-1111-4111-8111-aaaaaaaa5002';

interface Props {
  params: Promise<{ locale: string }>;
}

const REFERENCES_PAGE_SIZE = 200;

async function getAllPublishedReferences(locale: string): Promise<Reference[]> {
  const allReferences: Reference[] = [];

  for (let offset = 0; ; offset += REFERENCES_PAGE_SIZE) {
    const page = await getReferences(API_BASE_URL, {
      language: locale,
      is_published: true,
      limit: REFERENCES_PAGE_SIZE,
      offset,
    });

    allReferences.push(...page);

    if (page.length < REFERENCES_PAGE_SIZE) {
      return allReferences;
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Referenzen',
    description: 'Unsere Projekte und Referenzen — Kühltürme und Kühlanlagen weltweit.',
  };
}

export default async function ReferencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('references');

  const [references, subCategories] = await Promise.all([
    getAllPublishedReferences(locale).catch(() => []),
    getSubCategories(API_BASE_URL, {
      category_id: REFERENCES_CATEGORY_ID,
      language: locale,
    }).catch(() => []),
  ]);

  const categories = subCategories
    .map((category) => ({ id: category.id, name: category.name }))
    .filter((category) => category.id && category.name);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {references.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <section className="py-(--section-py) bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ReferencesGrid references={references} categories={categories} locale={locale} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
