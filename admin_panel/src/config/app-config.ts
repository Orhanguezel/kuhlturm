// =============================================================
// FILE: src/config/app-config.ts
// Admin Panel Config — DB'den gelen branding verileri için fallback
// =============================================================

import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export type AdminBrandingConfig = {
  app_name: string;
  app_copyright: string;
  html_lang: string;
  theme_color: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
  meta: {
    title: string;
    description: string;
    og_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
  };
};

export const DEFAULT_BRANDING: AdminBrandingConfig = {
  app_name: "Kühlturm Admin Panel",
  app_copyright: "Kühlturm",
  html_lang: "de",
  theme_color: "#1F6FEB",
  favicon_16: "/favicon/favicon.svg",
  favicon_32: "/favicon/favicon.svg",
  apple_touch_icon: "/favicon/apple-touch-icon.png",
  meta: {
    title: "Kühlturm - Industrielle Kühlturm-Lösungen",
    description:
      "Kühlturm bietet B2B-Lösungen für industrielle Kühltürme, Prozesskühlung und effiziente Wärmeabfuhr.",
    og_url: "https://kuhlturm.com/",
    og_title: "Kühlturm - Industrielle Kühlturm-Lösungen",
    og_description:
      "Professionelle Kühlturm-Lösungen für Industrie und Gewerbe.",
    og_image: "/logo/png/kuhlturm_logo_512.png",
    twitter_card: "summary_large_image",
  },
};

export const APP_CONFIG = {
  name: DEFAULT_BRANDING.app_name,
  version: packageJson.version,
  copyright: `© ${currentYear}, ${DEFAULT_BRANDING.app_copyright}.`,
  meta: {
    title: DEFAULT_BRANDING.meta.title,
    description: DEFAULT_BRANDING.meta.description,
  },
  branding: DEFAULT_BRANDING,
} as const;
