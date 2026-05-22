import { customType } from 'drizzle-orm/mysql-core';
import { z } from 'zod';

export { toBool, to01 } from '@ensotek/shared-backend/modules/_shared';

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal('0'),
  z.literal('1'),
  z.literal('true'),
  z.literal('false'),
]);
export const LOCALE_ENUM = z.enum(['de', 'en']);
export const REL_OR_URL = z
  .string()
  .refine((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), {
    message: 'URL veya relative path olmalı',
  });

export const longtext = customType<{ data: string | null; driverData: string | null }>({
  dataType() {
    return 'longtext';
  },
});

export type ListQuery = {
  order?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  sort?: string;
  limit?: string | number;
  offset?: string | number;
  is_published?: unknown;
  is_featured?: unknown;
  q?: string;
  slug?: string;
  category?: string;
  location?: string;
  client?: string;
  view?: 'card' | 'detail';
  select?: string;
};

export type ProjectListParams = {
  orderParam?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  is_published?: unknown;
  is_featured?: unknown;
  q?: string;
  slug?: string;
  category?: string;
  location?: string;
  client?: string;
  locale: string;
  defaultLocale: string;
};

export type ProjectMerged = Record<string, any>;

export function isRec(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isStr(value: unknown): value is string {
  return typeof value === 'string';
}

export function packStringArray(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  const arr = value.map((item) => String(item || '').trim()).filter(Boolean);
  return JSON.stringify(arr);
}

export function parseOrder(
  orderParam?: string,
  sort?: string,
  order?: 'asc' | 'desc',
): { col: string; dir: 'asc' | 'desc' } | null {
  const allowed = new Set(['created_at', 'updated_at', 'display_order']);
  if (orderParam) {
    const [col, dir] = String(orderParam).split('.');
    if (allowed.has(col)) {
      return { col, dir: dir === 'asc' ? 'asc' : 'desc' };
    }
  }
  if (sort && allowed.has(sort)) {
    return { col: sort, dir: order === 'asc' ? 'asc' : 'desc' };
  }
  return null;
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parseContent(value: unknown): Record<string, unknown> {
  if (isRec(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return { html: '' };
  try {
    const parsed = JSON.parse(value);
    return isRec(parsed) ? parsed : { html: value };
  } catch {
    return { html: value };
  }
}

export function toDetail(row: ProjectMerged): ProjectMerged {
  const content = parseContent(row.content);
  return {
    ...row,
    content,
    services: parseJsonArray(row.services),
    techs: parseJsonArray(row.techs),
  };
}

export function toCard(row: ProjectMerged): ProjectMerged {
  const detail = toDetail(row);
  return {
    ...detail,
    content: undefined,
  };
}

export const uuid36 = z.string().length(36);
