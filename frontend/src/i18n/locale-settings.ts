// Kuhlturm locale settings — delegates to @ensotek/core shared utility
import { getRuntimeLocaleSettings } from '@ensotek/core/i18n';
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from './locales';

export const API_BASE_URL = (typeof window === 'undefined' ? process.env.API_INTERNAL_URL : undefined) ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://kuhlturm.com/api';

export { getRuntimeLocaleSettings };

export function getLocaleSettings() {
  return getRuntimeLocaleSettings(API_BASE_URL, AVAILABLE_LOCALES, FALLBACK_LOCALE, { next: { revalidate: 300 } });
}
