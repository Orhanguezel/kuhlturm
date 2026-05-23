import type { FastifyInstance } from 'fastify';

import { registerFaqs } from '@/modules/faqs/router';
import { registerChat } from '@/modules/chat/router';
import { registerCatalog } from '@/modules/catalog/router';
import { registerSites } from '@/modules/sites/router';
import { registerProject } from '@/modules/projects/router';

import { registerFaqsAdmin } from '@/modules/faqs/admin.routes';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerCatalogAdmin } from '@/modules/catalog/admin.routes';
import { registerSitesAdmin } from '@/modules/sites/admin.routes';
import { registerProjectAdmin as registerProjectsAdmin } from '@/modules/projects/admin.routes';
import { registerChatAdmin } from '@/modules/chat/admin.routes';
import { registerIpBlocklist } from '@/modules/ip-blocklist/router';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerFaqs(api);
  await registerChat(api);
  await registerCatalog(api);
  await registerSites(api);
  await registerProject(api);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  await adminApi.register(registerFaqsAdmin);
  await adminApi.register(registerChatAdmin);
  await adminApi.register(registerDashboardAdmin);
  await adminApi.register(registerCatalogAdmin);
  await adminApi.register(registerSitesAdmin);
  await adminApi.register(registerProjectsAdmin);
  await adminApi.register(registerIpBlocklist);
}
