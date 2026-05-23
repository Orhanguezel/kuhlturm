import type { FastifyInstance } from 'fastify';

import { registerAuth } from '@ensotek/shared-backend/modules/auth/router';
import { registerStorage } from '@ensotek/shared-backend/modules/storage/router';
import { registerProfiles } from '@ensotek/shared-backend/modules/profiles/router';
import { registerCustomPages } from '@ensotek/shared-backend/modules/customPages/router';
import { registerSiteSettings } from '@ensotek/shared-backend/modules/siteSettings/router';
import { registerUserRoles } from '@ensotek/shared-backend/modules/userRoles/router';
import { registerServices } from '@ensotek/shared-backend/modules/services/router';
import { registerReferences } from '@ensotek/shared-backend/modules/references/router';
import { registerMenuItems } from '@ensotek/shared-backend/modules/menuItems/router';
import { registerSlider } from '@ensotek/shared-backend/modules/slider/router';
import { registerCategories } from '@ensotek/shared-backend/modules/categories/router';
import { registerSubCategories } from '@ensotek/shared-backend/modules/subcategories/router';
import { registerContacts } from '@ensotek/shared-backend/modules/contact/router';
import { registerEmailTemplates } from '@ensotek/shared-backend/modules/emailTemplates/router';
import { registerFooterSections } from '@ensotek/shared-backend/modules/footerSections/router';
import { registerLibrary } from '@ensotek/shared-backend/modules/library/router';
import { registerNewsletter } from '@ensotek/shared-backend/modules/newsletter/router';
import { registerNotifications } from '@ensotek/shared-backend/modules/notifications/router';
import { registerProducts } from '@ensotek/shared-backend/modules/products/router';
import { registerReviews } from '@ensotek/shared-backend/modules/review/router';
import { registerSupport } from '@ensotek/shared-backend/modules/support/router';
import { registerOffer } from '@ensotek/shared-backend/modules/offer/router';
import { registerAudit } from '@ensotek/shared-backend/modules/audit/router';
import { registerTelegram } from '@ensotek/shared-backend/modules/telegram/router';

import { registerCustomPagesAdmin } from '@ensotek/shared-backend/modules/customPages/admin.routes';
import { registerSiteSettingsAdmin } from '@ensotek/shared-backend/modules/siteSettings/admin.routes';
import { registerUserAdmin } from '@ensotek/shared-backend/modules/auth/admin.routes';
import { registerServicesAdmin } from '@ensotek/shared-backend/modules/services/admin.routes';
import { registerReferencesAdmin } from '@ensotek/shared-backend/modules/references/admin.routes';
import { registerStorageAdmin } from '@ensotek/shared-backend/modules/storage/admin.routes';
import { registerMenuItemsAdmin } from '@ensotek/shared-backend/modules/menuItems/admin.routes';
import { registerSliderAdmin } from '@ensotek/shared-backend/modules/slider/admin.routes';
import { registerCategoriesAdmin } from '@ensotek/shared-backend/modules/categories/admin.routes';
import { registerSubCategoriesAdmin } from '@ensotek/shared-backend/modules/subcategories/admin.routes';
import { registerContactsAdmin } from '@ensotek/shared-backend/modules/contact/admin.routes';
import { createDbAdminRoutes } from '@ensotek/shared-backend/modules/db_admin/admin.routes';
import type { ModuleMap } from '@ensotek/shared-backend/modules/db_admin/types';
import { registerEmailTemplatesAdmin } from '@ensotek/shared-backend/modules/emailTemplates/admin.routes';
import { registerFooterSectionsAdmin } from '@ensotek/shared-backend/modules/footerSections/admin.routes';
import { registerLibraryAdmin } from '@ensotek/shared-backend/modules/library/admin.routes';
import { registerNewsletterAdmin } from '@ensotek/shared-backend/modules/newsletter/admin.routes';
import { registerProductsAdmin } from '@ensotek/shared-backend/modules/products/admin.routes';
import { registerReviewsAdmin } from '@ensotek/shared-backend/modules/review/admin.routes';
import { registerSupportAdmin } from '@ensotek/shared-backend/modules/support/admin.routes';
import { registerOfferAdmin } from '@ensotek/shared-backend/modules/offer/admin.routes';
import { registerTelegramAdmin } from '@ensotek/shared-backend/modules/telegram/admin.routes';

const dbAdminModules = {
  site_settings: {
    tablesInOrder: ['site_settings'],
  },
  users: {
    tablesInOrder: ['users', 'profiles', 'user_roles'],
    truncateInOrder: ['profiles', 'user_roles', 'users'],
  },
  categories: {
    tablesInOrder: ['categories', 'category_i18n'],
    truncateInOrder: ['category_i18n', 'categories'],
  },
  subcategories: {
    tablesInOrder: ['sub_categories', 'sub_category_i18n'],
    truncateInOrder: ['sub_category_i18n', 'sub_categories'],
  },
  products: {
    tablesInOrder: ['products', 'product_i18n'],
    truncateInOrder: ['product_i18n', 'products'],
  },
  custom_pages: {
    tablesInOrder: ['custom_pages', 'custom_pages_i18n'],
    truncateInOrder: ['custom_pages_i18n', 'custom_pages'],
  },
  menu_items: {
    tablesInOrder: ['menu_items', 'menu_items_i18n'],
    truncateInOrder: ['menu_items_i18n', 'menu_items'],
  },
  footer_sections: {
    tablesInOrder: ['footer_sections', 'footer_sections_i18n'],
    truncateInOrder: ['footer_sections_i18n', 'footer_sections'],
  },
  storage: {
    tablesInOrder: ['storage_assets'],
  },
  services: {
    tablesInOrder: ['services', 'services_i18n', 'service_images', 'service_images_i18n'],
    truncateInOrder: ['service_images_i18n', 'service_images', 'services_i18n', 'services'],
  },
  catalog: {
    tablesInOrder: ['catalog_requests'],
  },
  projects: {
    tablesInOrder: ['projects', 'projects_i18n', 'project_images', 'project_images_i18n'],
    truncateInOrder: ['project_images_i18n', 'project_images', 'projects_i18n', 'projects'],
  },
  offers: {
    tablesInOrder: ['offer_number_counters', 'offers'],
    truncateInOrder: ['offers', 'offer_number_counters'],
  },
  reviews: {
    tablesInOrder: ['reviews', 'review_i18n'],
    truncateInOrder: ['review_i18n', 'reviews'],
  },
  notifications: {
    tablesInOrder: ['notifications'],
  },
  audit: {
    tablesInOrder: ['audit_request_logs', 'audit_auth_events', 'audit_events'],
  },
} satisfies ModuleMap;

const registerDbAdmin = createDbAdminRoutes(dbAdminModules);

export async function registerSharedPublic(api: FastifyInstance) {
  await registerAuth(api);
  await registerStorage(api);
  await registerProfiles(api);
  await registerCustomPages(api);
  await registerSiteSettings(api);
  await registerUserRoles(api);
  await registerServices(api);
  await registerReferences(api);
  await registerMenuItems(api);
  await registerSlider(api);
  await registerCategories(api);
  await registerSubCategories(api);
  await registerContacts(api);
  await registerEmailTemplates(api);
  await registerFooterSections(api);
  await registerLibrary(api);
  await registerNewsletter(api);
  await registerNotifications(api);
  await registerProducts(api);
  await registerReviews(api);
  await registerSupport(api);
  await registerTelegram(api);
  await registerOffer(api);
}

export async function registerSharedAdmin(adminApi: FastifyInstance) {
  await adminApi.register(registerAudit);
  await adminApi.register(registerCustomPagesAdmin);
  await adminApi.register(registerSiteSettingsAdmin);
  await adminApi.register(registerUserAdmin);
  await adminApi.register(registerServicesAdmin);
  await adminApi.register(registerReferencesAdmin);
  await adminApi.register(registerStorageAdmin);
  await adminApi.register(registerMenuItemsAdmin);
  await adminApi.register(registerSliderAdmin);
  await adminApi.register(registerCategoriesAdmin);
  await adminApi.register(registerSubCategoriesAdmin);
  await adminApi.register(registerContactsAdmin);
  await adminApi.register(registerDbAdmin);
  await adminApi.register(registerEmailTemplatesAdmin);
  await adminApi.register(registerFooterSectionsAdmin);
  await adminApi.register(registerLibraryAdmin);
  await adminApi.register(registerNewsletterAdmin);
  await adminApi.register(registerProductsAdmin);
  await adminApi.register(registerReviewsAdmin);
  await adminApi.register(registerSupportAdmin);
  await adminApi.register(registerTelegramAdmin);
  await adminApi.register(registerOfferAdmin);

  const { aiContentAssist } = await import('@ensotek/shared-backend/modules/ai/content');
  adminApi.post('/ai/content', aiContentAssist);
}
