import type { FastifyInstance } from 'fastify';

import { env } from '@/core/env';
import { isIpBlocked } from '@/modules/ip-blocklist/service';
import { shouldSkipAuditLog, writeRequestAuditLog } from '@ensotek/shared-backend/modules/audit/service';
import { registerSharedAdmin, registerSharedPublic } from './routes/shared';
import { registerProjectAdmin, registerProjectPublic } from './routes/project';

export async function registerAllRoutes(app: FastifyInstance) {
  await app.register(
    async (api) => {
      api.get('/health', async () => ({ ok: true }));

      api.addHook('onRequest', async (req, reply) => {
        if (req.url.startsWith('/api/admin')) return;
        const ip =
          (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
          req.socket?.remoteAddress ??
          '';
        if (!ip) return;
        if (env.AUDIT_EXCLUDE_IPS.includes(ip)) return;
        if (await isIpBlocked(ip)) {
          return reply.code(403).send({ error: { message: 'ip_blocked' } });
        }
      });

      api.addHook('onResponse', async (req, reply) => {
        try {
          if (shouldSkipAuditLog(req)) return;
          const reqId = String((req as any).id || (req as any).reqId || '');
          const elapsed =
            typeof (reply as any).elapsedTime === 'number' ? (reply as any).elapsedTime : 0;
          await writeRequestAuditLog({ req, reply, reqId, responseTimeMs: elapsed });
        } catch (err) {
          (req as any).log?.warn?.({ err }, 'audit_request_log_failed');
        }
      });

      await api.register(
        async (adminApi) => {
          await registerSharedAdmin(adminApi);
          await registerProjectAdmin(adminApi);
        },
        { prefix: '/admin' },
      );

      await registerSharedPublic(api);
      await registerProjectPublic(api);
    },
    { prefix: '/api' },
  );
}
