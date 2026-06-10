'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Reference } from '@ensotek/core/types';
import { resolveMediaUrl } from '@/lib/media';

type ReferenceCategory = {
  id: string;
  name: string;
};

type Props = {
  references: Reference[];
  categories: ReferenceCategory[];
  locale: string;
};

export function ReferencesGrid({ references, categories, locale }: Props) {
  const t = useTranslations('references');
  const [activeCategory, setActiveCategory] = useState('all');

  const usedCategories = useMemo(
    () => categories.filter((category) => references.some((ref) => getReferenceCategoryId(ref) === category.id)),
    [categories, references],
  );
  const featuredCount = useMemo(
    () => references.filter((reference) => reference.is_featured).length,
    [references],
  );

  const filteredReferences = useMemo(() => {
    if (activeCategory === 'all') return references;
    if (activeCategory === 'featured') return references.filter((reference) => reference.is_featured);
    return references.filter((reference) => getReferenceCategoryId(reference) === activeCategory);
  }, [activeCategory, references]);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        <FilterButton
          active={activeCategory === 'all'}
          label={t('allReferences')}
          count={references.length}
          onClick={() => setActiveCategory('all')}
        />
        {featuredCount > 0 && (
          <FilterButton
            active={activeCategory === 'featured'}
            label={t('featured')}
            count={featuredCount}
            onClick={() => setActiveCategory('featured')}
          />
        )}
        {usedCategories.map((category) => (
          <FilterButton
            key={category.id}
            active={activeCategory === category.id}
            label={category.name}
            count={references.filter((reference) => getReferenceCategoryId(reference) === category.id).length}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredReferences.map((reference) => (
          <ReferenceCard key={reference.id} reference={reference} locale={locale} />
        ))}
      </div>
    </>
  );
}

function getReferenceCategoryId(reference: Reference) {
  const text = `${reference.summary ?? ''} ${reference.content ?? ''}`.toLocaleLowerCase('de-DE');

  if (text.includes('aluminium')) return 'aluminium';
  if (text.includes('automotive') || text.includes('automobil')) return 'automotive';
  if (text.includes('cement') || text.includes('zement') || text.includes('mining') || text.includes('bergbau')) {
    return 'cement-mining';
  }
  if (text.includes('chemical') || text.includes('chemie')) return 'chemical';
  if (text.includes('commercial') || text.includes('gewerbebau')) return 'commercial';
  if (text.includes('energy') || text.includes('energie')) return 'energy';
  if (text.includes('engineering') || text.includes('maschinenbau')) return 'engineering';
  if (text.includes('food') || text.includes('lebensmittel') || text.includes('öl') || text.includes('oil')) return 'food-oil';
  if (text.includes('packaging') || text.includes('verpackung')) return 'packaging';
  if (text.includes('plastics') || text.includes('kunststoff')) return 'plastics';
  if (text.includes('steel') || text.includes('stahl') || text.includes('metal')) return 'steel-metal';
  if (text.includes('textile') || text.includes('textil')) return 'textile';

  return null;
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
        active
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700',
      ].join(' ')}
    >
      <span className="max-w-52 truncate">{label}</span>
      <span className={active ? 'ml-1.5 text-white/70' : 'ml-1.5 text-slate-400'}>({count})</span>
    </button>
  );
}

function ReferenceCard({ reference, locale }: { reference: Reference; locale: string }) {
  return (
    <Link
      href={`/${locale}/references/${reference.slug}`}
      className="group flex h-full min-h-44 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative aspect-square border-b border-slate-100 bg-white">
        {reference.featured_image ? (
          <Image
            src={resolveMediaUrl(reference.featured_image)}
            alt={reference.featured_image_alt ?? reference.title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-200">
            {reference.title?.charAt(0) || 'E'}
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center px-3 py-3 text-center">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
          {reference.title}
        </h2>
      </div>
    </Link>
  );
}
