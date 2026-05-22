// ===================================================================
// FILE: src/modules/dashboard/admin.controller.ts
// Kühlturm – Admin Dashboard Summary Controller
// ===================================================================

import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

// Aşağıdaki import'larda tablo isimlerini proje şemanla eşleştir:
// İsimler %99 bunlara çok yakın; farklıysa sadece import satırlarını düzeltmen yeterli.
import { products } from "@ensotek/shared-backend/modules/products/schema";
import { categories } from "@ensotek/shared-backend/modules/categories/schema";
import { subCategories} from "@ensotek/shared-backend/modules/subcategories/schema";
import { services } from "@ensotek/shared-backend/modules/services/schema";
import { faqs } from "@/modules/faqs/schema";
import { contact_messages } from "@ensotek/shared-backend/modules/contact/schema";
import { newsletterSubscribers } from "@ensotek/shared-backend/modules/newsletter/schema";
import { emailTemplates } from "@ensotek/shared-backend/modules/emailTemplates/schema";
import { siteSettings } from "@ensotek/shared-backend/modules/siteSettings/schema";
import { customPages } from "@ensotek/shared-backend/modules/customPages/schema";
import { menuItems } from "@ensotek/shared-backend/modules/menuItems/schema";
import { slider } from "@ensotek/shared-backend/modules/slider/schema";
import { footerSections } from "@ensotek/shared-backend/modules/footerSections/schema";
import { library } from "@ensotek/shared-backend/modules/library/schema";
import { reviews } from "@ensotek/shared-backend/modules/review/schema";
import { supportTickets } from "@ensotek/shared-backend/modules/support/schema";
import { users } from "@ensotek/shared-backend/modules/auth/schema";
import { offersTable } from '@ensotek/shared-backend/modules/offer/schema';
import { storageAssets } from '@ensotek/shared-backend/modules/storage/schema';
import { referencesTable } from '@ensotek/shared-backend/modules/references/schema';
import { catalogRequestsTable } from '@/modules/catalog/schema';
import { chat_threads } from '@/modules/chat/schema';

type DashboardCountItem = {
  key: string;
  label: string;
  count: number;
};

// Generic COUNT(*) helper
async function getCount(table: any): Promise<number> {
  const rows = await db
    .select({ c: sql<number>`COUNT(*)` })
    .from(table)
    .limit(1);
  return Number(rows[0]?.c ?? 0);
}

/**
 * GET /admin/dashboard/summary
 * Global içerik özetini döndürür.
 */
export const getDashboardSummaryAdmin: RouteHandler = async (req, reply) => {
  try {
    // Tanımlar: ICON_MAP ile uyumlu key'ler
    const defs: { key: string; label: string; table: any }[] = [
      { key: "products", label: "Ürünler", table: products },
      { key: "categories", label: "Kategoriler", table: categories },
      { key: "subcategories", label: "Alt Kategoriler", table: subCategories },
      { key: "services", label: "Hizmetler", table: services },
      { key: "faqs", label: "SSS", table: faqs },
      { key: "contacts", label: "İletişim Mesajları", table: contact_messages },
      { key: "newsletter", label: "Bülten Aboneleri", table: newsletterSubscribers },
      { key: "email_templates", label: "E-posta Şablonları", table: emailTemplates },
      { key: "site_settings", label: "Site Ayarları", table: siteSettings },
      { key: "custom_pages", label: "Özel Sayfalar", table: customPages },
      { key: "menu_items", label: "Menü Öğeleri", table: menuItems },
      { key: "sliders", label: "Slider Öğeleri", table: slider },
      { key: "footer_sections", label: "Footer Bölümleri", table: footerSections },
      { key: "library", label: "Kütüphane / Library", table: library },
      { key: "reviews", label: "Yorumlar", table: reviews },
      { key: "support", label: "Destek Talepleri", table: supportTickets },
      { key: "users", label: "Kullanıcılar", table: users },
      { key: "offers", label: "Teklifler", table: offersTable },
      { key: "storage", label: "Depolama Öğeleri", table: storageAssets },
      { key: "references", label: "Referanslar", table: referencesTable },
      { key: "catalog_requests", label: "Katalog Talepleri", table: catalogRequestsTable },
      { key: "chat", label: "Sohbet", table: chat_threads },
    ];

    // Hepsini paralel say
    const counts = await Promise.all(defs.map((d) => getCount(d.table)));

    const items: DashboardCountItem[] = defs.map((d, idx) => ({
      key: d.key,
      label: d.label,
      count: counts[idx] ?? 0,
    }));

    return reply.send({ items });
  } catch (err) {
    req.log.error({ err }, "dashboard_summary_failed");
    return reply
      .code(500)
      .send({ error: { message: "dashboard_summary_failed" } });
  }
};
