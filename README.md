# Kühlturm

Soğutma kulesi (Kühlturm) çözümleri için **B2B web platformu** — Almanca + İngilizce pazar sitesi. ensotek_de mimarisinin neredeyse aynısı; veritabanı ve marka ayrı.

🌐 Domain: kuhlturm.com

## Yapı

| Klasör | Açıklama | Stack | Port |
|--------|----------|-------|------|
| `frontend/` | Genel kullanıcı sitesi | Next.js 16, React 19, next-intl (DE+EN), React Query, Tailwind v4 | 3025 |
| `backend/` | REST API | Fastify 5, Drizzle ORM, MySQL, Zod | 8089 |
| `admin_panel/` | Yönetim paneli | Next.js 16, Redux Toolkit, Tailwind v4 | 3023 |

Veritabanı: MySQL — **`kuhlturm`** (ensotek_de'nin `ensotek` DB'sinden tamamen ayrı).

## Kurulum & Çalıştırma

```bash
# frontend
cd frontend && bun install && bun run dev    # port 3025

# backend
cd backend && bun install && bun run dev
bun run db:seed                  # şema + seed
bun run db:seed:nodrop           # drop'suz re-seed

# admin_panel
cd admin_panel && bun install && bun run dev    # port 3023
```

## Ortam Değişkenleri

`.env` dosyaları repoya **dahil değildir** (`.gitignore`). Her uygulamada `.env.example` örnek alınır:
- `backend/.env.example` — DB=kuhlturm, PORT=8089, locale DE+EN
- `admin_panel/.env.example` — API URL backend'e, locale DE+EN
- `frontend/.env.example`

## Deploy

- **VPS:** `ssh vps-Ensotek` (Hostinger, Ubuntu)
- **PM2:** `kuhlturm-backend` (8089), `kuhlturm-frontend`, `kuhlturm-admin-panel` (3023)
- **Domain:** kuhlturm.com — nginx reverse proxy

> Şema değişikliği: `ALTER TABLE` kullanılmaz. İlgili `src/db/seed/sql/0XX_*_schema.sql` güncellenir, `db:seed:*:fresh` ile DB sıfırdan kurulur.

## Köken (Origin) — ensotek_de'den klonlandı

backend ve admin_panel iskeletleri `ensotek_de`'den kopyalandı; kritik configler (paket isimleri, portlar, ecosystem cwd, env, DB adı) kuhlturm'a göre uyarlandı. Marka ismi (Ensotek → Kühlturm), TR locale temizliği, seed branding normalizasyonu ve frontend PM2 konfigürasyonu Codex tarafında ele alındı. `backend/src/modules` tekrarlarını shared-backend'e taşıma işi Claude kapsamındadır: [`docs/kuhlturm-codex-brief.md`](docs/kuhlturm-codex-brief.md).

## Ortak Paketler

`Ensotek/packages/` altındaki `shared-backend`, `shared-config`, `shared-types`, `shared-ui` paketleri root `bun` workspace üzerinden kullanılır. `kuhlturm/backend` ve `kuhlturm/admin_panel` root workspace'e eklidir.
