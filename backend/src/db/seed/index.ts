// src/db/seed/index.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { env } from '@/core/env';
import { cleanSql, splitStatements, logStep } from './utils';

// ESM için __dirname/__filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Flags = {
  noDrop?: boolean;
  only?: string[]; // ör: ["40","41","50"] -> sadece o dosyalar
  profile?: string;
};

function parseFlags(argv: string[]): Flags {
  const flags: Flags = {};
  for (const a of argv.slice(2)) {
    if (a === '--no-drop') flags.noDrop = true;
    else if (a.startsWith('--only=')) {
      flags.only = a.replace('--only=', '').split(',').map(s => s.trim());
    } else if (a.startsWith('--profile=')) {
      flags.profile = a.replace('--profile=', '').trim();
    }
  }
  return flags;
}

function assertSafeToDrop(dbName: string) {
  const allowDrop = process.env.ALLOW_DROP === 'true';
  const isProd = process.env.NODE_ENV === 'production';
  const isSystem = ['mysql','information_schema','performance_schema','sys'].includes(dbName.toLowerCase());
  if (isSystem) throw new Error(`Sistem DB'si drop edilemez: ${dbName}`);
  if (isProd && !allowDrop) throw new Error('Prod ortamda DROP için ALLOW_DROP=true bekleniyor.');
}

async function dropAndCreate(root: mysql.Connection) {
  assertSafeToDrop(env.DB.name);
  await root.query(`DROP DATABASE IF EXISTS \`${env.DB.name}\`;`);
  await root.query(
    `CREATE DATABASE \`${env.DB.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
}

async function createRoot(): Promise<mysql.Connection> {
  return mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    multipleStatements: true,
  });
}

async function createConnToDb(): Promise<mysql.Connection> {
  return mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: env.DB.name,
    multipleStatements: true,
    // unicode_ci ile uyumlu
    charset: 'utf8mb4_unicode_ci',
  });
}

function shouldRun(file: string, flags: Flags) {
  if (!flags.only?.length) return true;
  const m = path.basename(file).match(/^(\d+)/);
  const prefix = m?.[1];
  return prefix ? flags.only.includes(prefix) : false;
}

/** admin değişkenlerini ENV'den oku + bcrypt üret */
function getAdminVars() {
  const email = (process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@example.com').trim();
  const id = (process.env.SEED_ADMIN_ID || process.env.ADMIN_ID || '4f618a8d-6fdb-498c-898a-395d368b2193').trim();
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(plainPassword, 12);
  return { email, id, passwordHash };
}

/** SQL string güvenli tek tırnak escape */
function sqlStr(v: string) {
  return v.replaceAll("'", "''");
}

/** Dosyayı oku, temizle, admin değişkenleri enjekte et ve opsiyonel yer tutucu değiştir */
function prepareSqlForRun(rawSql: string, admin: { email: string; id: string; passwordHash: string }) {
  // Dosyadaki comment/boşluk temizliği
  let sql = cleanSql(rawSql);

  // Header ile session değişkenlerini set et (dosyada COALESCE olsa bile önce biz set ediyoruz)
  const header = [
    `SET @ADMIN_EMAIL := '${sqlStr(admin.email)}';`,
    `SET @ADMIN_ID := '${sqlStr(admin.id)}';`,
    `SET @ADMIN_PASSWORD_HASH := '${sqlStr(admin.passwordHash)}';`
  ].join('\n');

  // Eski yer tutucu kalıplarını da destekle (örn: {{ADMIN_BCRYPT}})
  sql = sql
    .replaceAll('{{ADMIN_BCRYPT}}', admin.passwordHash)
    .replaceAll('{{ADMIN_PASSWORD_HASH}}', admin.passwordHash)
    .replaceAll('{{ADMIN_EMAIL}}', admin.email)
    .replaceAll('{{ADMIN_ID}}', admin.id);

  // En üstte header'ı ekle
  sql = `${header}\n${sql}`;

  return sql;
}

async function runSqlFile(conn: mysql.Connection, absPath: string, adminVars: { email: string; id: string; passwordHash: string }) {
  const name = path.basename(absPath);
  logStep(`⏳ ${name} çalışıyor...`);
  const raw = fs.readFileSync(absPath, 'utf8');

  const sql = prepareSqlForRun(raw, adminVars);
  const statements = splitStatements(sql);

  // bağlantı karakter seti & timezone
  await conn.query('SET NAMES utf8mb4;');
  await conn.query("SET time_zone = '+00:00';");

  for (const stmt of statements) {
    if (!stmt) continue;
    try {
      await conn.query(stmt);
    } catch (err: any) {
      // 1060: Duplicate column name -> "ADD COLUMN" idempotent yapmak için
      // 1061: Duplicate key name -> "ADD INDEX" idempotent yapmak için
      // 1050: Table already exists -> "CREATE TABLE" (genelde IF NOT EXISTS varsa fırlamaz ama yine de)
      if (err.errno === 1060 || err.errno === 1061) {
        // debug log isteğe bağlı, şimdilik sessiz geç
      } else {
        throw err;
      }
    }
  }
  logStep(`✅ ${name} bitti`);
}

async function removeUnsupportedLocaleRows(conn: mysql.Connection) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `
      SELECT DISTINCT table_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND column_name = 'locale'
    `,
  );

  for (const row of rows) {
    const tableName = String(row.table_name || '').replaceAll('`', '');
    if (!tableName) continue;
    await conn.query(`DELETE FROM \`${tableName}\` WHERE \`locale\` = ?`, ['tr']);
  }
}

function escapeIdentifier(value: string) {
  return `\`${value.replaceAll('`', '``')}\``;
}

async function normalizeKuhlturmBranding(conn: mysql.Connection) {
  const replacements: Array<[string, string]> = [
    ['https://www.ensotek.de', 'https://kuhlturm.com'],
    ['https://ensotek.de', 'https://kuhlturm.com'],
    ['http://www.ensotek.de', 'https://kuhlturm.com'],
    ['http://ensotek.de', 'https://kuhlturm.com'],
    ['https://www.ensotek.com.tr', 'https://kuhlturm.com'],
    ['https://ensotek.com.tr', 'https://kuhlturm.com'],
    ['https://www.ensotek.com', 'https://kuhlturm.com'],
    ['https://ensotek.com', 'https://kuhlturm.com'],
    ['www.ensotek.de', 'kuhlturm.com'],
    ['ensotek.de', 'kuhlturm.com'],
    ['ensotek.com.tr', 'kuhlturm.com'],
    ['ensotek.com', 'kuhlturm.com'],
    ['ENSOTEK', 'KÜHLTURM'],
    ['Ensotek', 'Kühlturm'],
    ['ensotek', 'kuhlturm'],
  ];

  const [columns] = await conn.query<mysql.RowDataPacket[]>(
    `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND data_type IN ('char','varchar','tinytext','text','mediumtext','longtext','json')
    `,
  );

  for (const row of columns) {
    const tableName = String(row.table_name || '');
    const columnName = String(row.column_name || '');
    if (!tableName || !columnName) continue;

    const table = escapeIdentifier(tableName);
    const column = escapeIdentifier(columnName);
    const expr = replacements.reduce((acc) => `REPLACE(${acc}, ?, ?)`, column);
    const where = replacements.map(() => `${column} LIKE ?`).join(' OR ');
    const params = [
      ...replacements.flatMap(([from, to]) => [from, to]),
      ...replacements.map(([from]) => `%${from}%`),
    ];
    await conn.query(`UPDATE ${table} SET ${column} = ${expr} WHERE ${where}`, params);
  }
}

async function applyKuhlturmSeedOverrides(conn: mysql.Connection) {
  const settings: Array<[string, string, string]> = [
    ['site_title', '*', 'Kühlturm'],
    ['site_title', 'de', 'Kühlturm'],
    ['site_title', 'en', 'Kühlturm'],
    ['catalog_pdf_filename', 'de', 'kuhlturm-katalog.pdf'],
    ['catalog_pdf_filename', 'en', 'kuhlturm-catalog.pdf'],
    ['catalog_pdf_url', 'de', 'https://kuhlturm.com/uploads/catalog/kuhlturm-katalog.pdf'],
    ['catalog_pdf_url', 'en', 'https://kuhlturm.com/uploads/catalog/kuhlturm-catalog.pdf'],
    ['catalog_admin_email', 'de', 'info@kuhlturm.com'],
    ['catalog_admin_email', 'en', 'info@kuhlturm.com'],
    ['smtp_from_email', '*', 'no-reply@kuhlturm.com'],
    ['smtp_from_name', '*', 'Kühlturm'],
    ['footer_company_name', '*', 'Kühlturm'],
  ];

  for (const [key, locale, value] of settings) {
    await conn.query(
      `
        INSERT INTO site_settings (id, \`key\`, locale, value, created_at, updated_at)
        VALUES (UUID(), ?, ?, ?, NOW(3), NOW(3))
        ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)
      `,
      [key, locale, value],
    );
  }

  const brand = JSON.stringify({
    name: 'Kühlturm',
    shortName: 'Kühlturm',
    website: 'https://kuhlturm.com',
  });
  const contact = JSON.stringify({
    company_name: 'Kühlturm',
    phone: '+90 212 613 33 01',
    phone_2: '+90 531 880 31 51',
    email: 'info@kuhlturm.com',
    email_2: 'export@kuhlturm.com',
    address: 'Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / Istanbul, Türkiye',
    city: 'Istanbul',
    country: 'Türkiye',
    working_hours: 'Mon-Fri 08:00-18:00',
    maps_embed_url: '',
    maps_lat: '41.0436',
    maps_lng: '28.8820',
  });
  const media = [
    ['site_logo', '*', '/logo/ensotek-logo-main.png'],
    ['site_logo_dark', '*', '/logo/ensotek-logo-main.png'],
    ['site_favicon', '*', '/favicon/favicon.svg'],
    ['site_apple_touch_icon', '*', '/favicon/apple-touch-icon.png'],
    ['og_image', '*', '/logo/ensotek-logo-main.png'],
  ] as const;

  for (const locale of ['*', 'de', 'en']) {
    await conn.query(
      `
        INSERT INTO site_settings (id, \`key\`, locale, value, created_at, updated_at)
        VALUES (UUID(), 'company_brand', ?, ?, NOW(3), NOW(3))
        ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)
      `,
      [locale, brand],
    );
  }
  for (const locale of ['de', 'en']) {
    await conn.query(
      `
        INSERT INTO site_settings (id, \`key\`, locale, value, created_at, updated_at)
        VALUES (UUID(), 'contact_info', ?, ?, NOW(3), NOW(3))
        ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)
      `,
      [locale, contact],
    );
  }
  for (const [key, locale, value] of media) {
    await conn.query(
      `
        INSERT INTO site_settings (id, \`key\`, locale, value, created_at, updated_at)
        VALUES (UUID(), ?, ?, ?, NOW(3), NOW(3))
        ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)
      `,
      [key, locale, value],
    );
  }
}

async function main() {
  const flags = parseFlags(process.argv);
  if (flags.profile && flags.profile !== 'kuhlturm') {
    throw new Error(`Unsupported seed profile: ${flags.profile}. Expected "kuhlturm" or no --profile.`);
  }
  if (flags.profile) {
    logStep(`🏷️ Seed profile: ${flags.profile}`);
  }

  // 1) Root ile drop + create (opsiyonel)
  const root = await createRoot();
  try {
    if (!flags.noDrop) {
      logStep('💣 DROP + CREATE başlıyor');
      await dropAndCreate(root);
      logStep('🆕 DB oluşturuldu');
    } else {
      logStep('⤵️ --no-drop: DROP/CREATE atlanıyor');
    }
  } finally {
    await root.end();
  }

  // 2) DB bağlantısı
  const conn = await createConnToDb();

  try {
    // 3) Admin değişkenlerini hazırla (tek sefer)
    const ADMIN = getAdminVars();

    // 4) SQL klasörünü bul (öncelik env, sonra dist/sql, yoksa src/sql)
    const envDir = process.env.SEED_SQL_DIR && process.env.SEED_SQL_DIR.trim();
    const distSql = path.resolve(__dirname, 'sql');
    const srcSql  = path.resolve(__dirname, '../../../src/db/seed/sql');
    const sqlDir  = envDir ? path.resolve(envDir) : (fs.existsSync(distSql) ? distSql : srcSql);

    const files = fs.readdirSync(sqlDir)
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const f of files) {
      const abs = path.join(sqlDir, f);
      if (!shouldRun(abs, flags)) {
        logStep(`⏭️ ${f} atlandı (--only filtresi)`);
        continue;
      }
      await runSqlFile(conn, abs, ADMIN);
    }
    await removeUnsupportedLocaleRows(conn);
    logStep('🧹 Unsupported locale rows removed (tr)');
    await normalizeKuhlturmBranding(conn);
    logStep('🏷️ Kühlturm branding normalized');
    await applyKuhlturmSeedOverrides(conn);
    logStep('🎛️ Kühlturm seed overrides applied');
    logStep('🎉 Seed tamamlandı.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
