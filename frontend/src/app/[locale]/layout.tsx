import { LeadEvents } from '../../../../../packages/shared-ui/public/components/analytics/LeadEvents';
import { StructuredData } from '@/components/ui/StructuredData';
import { SITE_URL } from '@/lib/seo';
import { ConsentGate } from '../../../../../packages/shared-ui/public/components/analytics/ConsentGate';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Syne } from 'next/font/google';
import { ClientToaster } from '@/components/ui/ClientToaster';
import { AVAILABLE_LOCALES, getLocaleMessages } from '@/i18n/locales';
import { getLocaleSettings } from '@/i18n/locale-settings';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { FloatingWidgets } from '@/components/widgets/FloatingWidgets';
import { WhatsAppFloating } from '@/components/widgets/WhatsAppFloating';
import { getMenuItems, getFooterSections } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';
import { fetchSetting } from '@/i18n/server';
import type { MenuItem, FooterSection } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export async function generateStaticParams() {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://kuhlturm.com';

  const [seoRow, faviconRow] = await Promise.all([
    fetchSetting('seo', locale, { revalidate: 300 }),
    fetchSetting('site_favicon', locale, { revalidate: 300 }),
  ]);

  const seo = seoRow?.value as Record<string, any> | null;
  const faviconUrl =
    (faviconRow?.value as Record<string, any> | null)?.url ?? '/favicon.ico';

  const title: string = seo?.title_default ?? 'Kühlturm';
  const description: string =
    seo?.description ?? 'Professionelle Kühltürme und Kühllösungen für Industrie und Gewerbe.';
  const siteName: string = seo?.site_name ?? 'Kühlturm';
  const titleTemplate: string = seo?.title_template ?? '%s | Kühlturm';

  const ogImages: string[] = Array.isArray(seo?.open_graph?.images)
    ? seo.open_graph.images.filter((u: unknown): u is string => typeof u === 'string')
    : [];

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: titleTemplate },
    description,
    authors: [{ name: siteName }],
    publisher: siteName,
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      images: ogImages,
      locale: `${locale}_${locale.toUpperCase()}`,
    },
    ...(seo?.facebook?.app_id
      ? { other: { 'fb:app_id': String(seo.facebook.app_id) } }
      : {}),
    twitter: {
      card: (seo?.twitter?.card as any) ?? 'summary_large_image',
      site: seo?.twitter?.site ?? undefined,
      creator: seo?.twitter?.creator ?? undefined,
      title,
      description,
      images: ogImages,
    },
    robots:
      seo?.robots != null
        ? {
            index: seo.robots.index !== false,
            follow: seo.robots.follow !== false,
          }
        : { index: true, follow: true },
    icons: { icon: faviconUrl },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!AVAILABLE_LOCALES.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = getLocaleMessages(locale);

  const [menuItems, footerSections, footerLinks, logoSetting, contactSetting, socialSetting, { activeLocales }, analyticsSetting] = await Promise.all([
    apiFetchWithLocale<MenuItem[]>('/menu_items', locale, { params: { location: 'header' } }).then(d => d ?? []),
    apiFetchWithLocale<FooterSection[]>('/footer_sections', locale, { params: { is_active: true } }).then(d => d ?? []),
    apiFetchWithLocale<MenuItem[]>('/menu_items', locale, { params: { location: 'footer' } }).then(d => d ?? []),
    fetchSetting('site_logo', locale, { revalidate: 3600 }),
    fetchSetting('contact_info', locale, { revalidate: 3600 }),
    fetchSetting('socials', locale, { revalidate: 3600 }),
    getLocaleSettings(),
    fetchSetting('kuhlturm_ga4_measurement_id', locale, { revalidate: 300 }),
  ]);

  const measurementId = typeof analyticsSetting?.value === 'string'
    ? analyticsSetting.value.trim() : '';

  // Extract logo URL from setting value (may be a string URL or { url: string })
  const logoSrc = (() => {
    const v = logoSetting?.value;
    if (!v) return null;
    if (typeof v === 'string') return v || null;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const url = (v as Record<string, unknown>).url ?? (v as Record<string, unknown>).src ?? (v as Record<string, unknown>).site_logo;
      return typeof url === 'string' ? url || null : null;
    }
    return null;
  })();

  const contactInfo = contactSetting?.value as any || {};
  const socials = socialSetting?.value as any || {};

  return (
    <html lang={locale} className={`${inter.variable} ${syne.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StructuredData data={{ '@context': 'https://schema.org', '@graph': [
          { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Ensotek', legalName: contactInfo.company_name || undefined, telephone: contactInfo.phone || undefined, email: contactInfo.email || undefined, sameAs: Object.values(socials).filter((value): value is string => typeof value === 'string' && /^https:\/\//.test(value)), url: 'https://ensotek.de', ...(logoSrc ? { logo: new URL(logoSrc, SITE_URL).href } : {}), brand: { '@type': 'Brand', name: 'Kühlturm' } },
          { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'Kühlturm · Ensotek', inLanguage: locale, publisher: { '@id': `${SITE_URL}/#organization` } },
        ] }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={menuItems} logoSrc={logoSrc} />
          {children}
          <Footer locale={locale} footerSections={footerSections} footerLinks={footerLinks} logoSrc={logoSrc} />
          <FloatingWidgets 
            activeLocales={activeLocales.map(code => ({ code, label: code.toUpperCase() }))}
            contactInfo={contactInfo}
            socials={socials}
          />
          <WhatsAppFloating number={contactInfo.whatsapp || contactInfo.phone_2} />
          <ScrollToTop />
          <ClientToaster />
        </NextIntlClientProvider>
      </body>
      {/^G-[A-Z0-9]+$/.test(measurementId) && <ConsentGate locale={locale}><LeadEvents measurementId={measurementId} locale={locale} /><GoogleAnalytics gaId={measurementId} /></ConsentGate>}
    </html>
  );
}
