// src/modules/services/router.ts
// =============================================================

import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { serviceListQuerySchema } from "./validation";
import {
  listServicesPublic,
  getServicePublic,
  getServiceBySlugPublic,
  listServiceImagesPublic,
} from "./controller";

const BASE = "/services";

export async function registerServices(app: FastifyInstance) {
  const api = app;

  api.get(
    `${BASE}`,
    {
      config: { public: true },
      schema: {
        querystring: zodToJsonSchema(serviceListQuerySchema, { target: "jsonSchema7", $refStrategy: "none" }),
        tags: ["Services"],
        description: "Public service list",
      },
    },
    listServicesPublic as any,
  );
  api.get(`${BASE}/:id`, { config: { public: true } }, getServicePublic as any);
  api.get(
    `${BASE}/by-slug/:slug`,
    { config: { public: true } },
    getServiceBySlugPublic as any,
  );

  // gallery (public)
  app.get(
    `${BASE}/:id/images`,
    { config: { public: true } },
    listServiceImagesPublic,
  );
}
