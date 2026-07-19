// =============================================================
// FILE: src/app.ts
// FIX: Audit module single-entry mount (registerAudit) + remove duplicate stream mount
// =============================================================

import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import authPlugin from './plugins/authPlugin';
import mysqlPlugin from '@/plugins/mysql';
import staticUploads from './plugins/staticUploads';
import { localeMiddleware } from '@/common/middleware/locale';

import type { FastifyInstance } from 'fastify';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@/core/error';
import { registerAllRoutes } from './routes';
import { startRetentionJob } from '@ensotek/shared-backend/modules/audit/service';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

function parseCorsOrigins(v?: string | string[]): boolean | string[] {
  if (!v) return true;
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  if (!s) return true;
  const arr = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  return arr.length ? arr : true;
}

export async function createApp() {
  const { default: buildFastify } = (await import('fastify')) as unknown as {
    default: (opts?: Parameters<FastifyInstance['log']['child']>[0]) => FastifyInstance;
  };

  const app = buildFastify({
    logger: env.NODE_ENV !== 'production',
  }) as FastifyInstance;

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN as any),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-lang',
      'Prefer',
      'Accept',
      'Accept-Language',
      'X-Locale',
      'x-skip-auth',
      'Range',
    ],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  // Swagger docs
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Kühlturm API',
        description: 'Kühlturm Backend API Documentation',
        version: '0.1.0',
      },
      servers: [
        {
          url: `http://${process.env.HOST || 'localhost'}:${env.PORT}`,
          description: 'Local server',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    // transformStaticCSP allow 'unsafe-inline' because of Swagger UI inline styles issue
    staticCSP: true,
    transformStaticCSP: (header) => {
      return header.replace('style-src', "style-src 'unsafe-inline'");
    },
  });

  const cookieSecret = env.COOKIE_SECRET;

  await app.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });

  app.addHook('onRequest', localeMiddleware);

  await app.register(authPlugin);
  await app.register(mysqlPlugin);

  app.get('/health', async () => ({ ok: true }));

  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  await app.register(staticUploads);

  await registerAllRoutes(app);

  registerErrorHandlers(app);

  // Audit log retention cleanup (runs daily)
  startRetentionJob();

  return app;
}
