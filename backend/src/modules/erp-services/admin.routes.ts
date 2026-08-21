import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { requireAuth } from '@ensotek/shared-backend/middleware/auth';
import { requireAdmin } from '@ensotek/shared-backend/middleware/roles';
import { pool as defaultPool } from '@/db/client';

type Item = Record<string, unknown>;
const guard = { preHandler: [requireAuth, requireAdmin] };

function localeOf(value: unknown) {
  return typeof value === 'string' && /^[a-zA-Z]{2,3}(?:[-_][a-zA-Z0-9]{2,8})?$/.test(value) ? value : 'tr';
}

function nullable(value: unknown) {
  return value === '' || value === undefined ? null : value;
}

const SELECT = `SELECT s.id,s.type,s.category_id,s.sub_category_id,s.featured,s.is_active,
  s.display_order,s.featured_image,s.image_url,s.image_asset_id,s.images,s.area,s.duration,
  s.maintenance,s.season,s.thickness,s.equipment,s.created_at,s.updated_at,
  i.locale,i.slug,i.name,i.description,i.material,i.price,i.includes,i.warranty,
  i.image_alt,i.tags,i.meta_title,i.meta_description,i.meta_keywords
  FROM services s INNER JOIN services_i18n i ON i.service_id=s.id`;

export function createErpServicesAdmin(pool: Pool = defaultPool) {
  return async function registerErpServicesAdmin(app: FastifyInstance) {
    const base = '/erp-services';

    app.get(base, guard, async (req) => {
      const locale = localeOf((req.query as Item | undefined)?.locale);
      const [rows] = await pool.query<RowDataPacket[]>(`${SELECT} WHERE i.locale=? ORDER BY s.display_order,s.created_at`, [locale]);
      return rows;
    });

    app.get(`${base}/:id`, guard, async (req, reply) => {
      const { id } = req.params as { id: string };
      const locale = localeOf((req.query as Item | undefined)?.locale);
      const [rows] = await pool.query<RowDataPacket[]>(`${SELECT} WHERE s.id=? AND i.locale=? LIMIT 1`, [id, locale]);
      if (!rows[0]) return reply.status(404).send({ error: { message: 'not_found' } });
      return rows[0];
    });

    app.post(base, guard, async (req, reply) => {
      const body = (req.body ?? {}) as Item;
      const name = String(body.name ?? '').trim();
      const slug = String(body.slug ?? '').trim();
      if (!name || !slug) return reply.status(400).send({ error: { message: 'name_and_slug_required' } });
      const id = randomUUID();
      const locale = localeOf(body.locale);
      const i18nId = randomUUID();
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query(
          `INSERT INTO services
            (id,type,category_id,sub_category_id,featured,is_active,display_order,featured_image,image_url,image_asset_id,images)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
          [id, body.type ?? 'other', nullable(body.category_id), nullable(body.sub_category_id), Number(Boolean(body.featured)),
            body.is_active === false || body.is_active === 0 ? 0 : 1, Number(body.display_order ?? 0), nullable(body.featured_image),
            nullable(body.image_url), nullable(body.image_asset_id), body.images ? JSON.stringify(body.images) : null],
        );
        await conn.query(
          `INSERT INTO services_i18n
            (id,service_id,locale,slug,name,description,material,price,includes,warranty,image_alt,tags,meta_title,meta_description,meta_keywords)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [i18nId, id, locale, slug, name, nullable(body.description), nullable(body.material), nullable(body.price),
            nullable(body.includes), nullable(body.warranty), nullable(body.image_alt ?? body.alt), nullable(body.tags),
            nullable(body.meta_title), nullable(body.meta_description), nullable(body.meta_keywords)],
        );
        await conn.commit();
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
      const [rows] = await pool.query<RowDataPacket[]>(`${SELECT} WHERE s.id=? AND i.locale=? LIMIT 1`, [id, locale]);
      return reply.status(201).send(rows[0]);
    });

    app.patch(`${base}/:id`, guard, async (req, reply) => {
      const { id } = req.params as { id: string };
      const body = (req.body ?? {}) as Item;
      const locale = localeOf(body.locale);
      const baseMap: Record<string, unknown> = {
        type: body.type, category_id: body.category_id, sub_category_id: body.sub_category_id,
        featured: body.featured, is_active: body.is_active, display_order: body.display_order,
        featured_image: body.featured_image, image_url: body.image_url, image_asset_id: body.image_asset_id,
      };
      const i18nMap: Record<string, unknown> = {
        slug: body.slug, name: body.name, description: body.description, material: body.material,
        price: body.price, includes: body.includes, warranty: body.warranty,
        image_alt: body.image_alt ?? body.alt, tags: body.tags, meta_title: body.meta_title,
        meta_description: body.meta_description, meta_keywords: body.meta_keywords,
      };
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const [exists] = await conn.query<RowDataPacket[]>('SELECT id FROM services WHERE id=? LIMIT 1', [id]);
        if (!exists[0]) {
          await conn.rollback();
          return reply.status(404).send({ error: { message: 'not_found' } });
        }
        const baseEntries = Object.entries(baseMap).filter(([, value]) => value !== undefined);
        if (baseEntries.length) await conn.query(
          `UPDATE services SET ${baseEntries.map(([key]) => `\`${key}\`=?`).join(',')} WHERE id=?`,
          [...baseEntries.map(([, value]) => nullable(value)), id],
        );
        const i18nEntries = Object.entries(i18nMap).filter(([, value]) => value !== undefined);
        if (i18nEntries.length) await conn.query(
          `UPDATE services_i18n SET ${i18nEntries.map(([key]) => `\`${key}\`=?`).join(',')} WHERE service_id=? AND locale=?`,
          [...i18nEntries.map(([, value]) => nullable(value)), id, locale],
        );
        await conn.commit();
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
      const [rows] = await pool.query<RowDataPacket[]>(`${SELECT} WHERE s.id=? AND i.locale=? LIMIT 1`, [id, locale]);
      return rows[0];
    });

    app.delete(`${base}/:id`, guard, async (req, reply) => {
      const { id } = req.params as { id: string };
      const [result] = await pool.query<ResultSetHeader>('DELETE FROM services WHERE id=?', [id]);
      if (!result.affectedRows) return reply.status(404).send({ error: { message: 'not_found' } });
      return { ok: true };
    });
  };
}

export const registerErpServicesAdmin = createErpServicesAdmin();
