# Kühlturm — Codex Görev Checklist'i

> kuhlturm/backend ve kuhlturm/admin_panel iskeletleri **ensotek_de'den klonlandı** (Claude Code, 2026-05-23). Codex kapsamı: branding/locale/env/PM2/seed doğrulama ve build. `backend/src/modules` içindeki modül tekrarlarını kaldırma ve `packages/shared-backend/modules` kullanımına geçirme işi Claude kapsamındadır. Detay bağlam: [`kuhlturm-codex-brief.md`](kuhlturm-codex-brief.md).

> **10 Eylül 2026 güncel durum:** Aşağıdaki Mayıs işaretleri tarihsel uygulama kayıtlarıdır; bugünkü canlı kabul yerine geçmez. [İşletim kaydı](runtime-isolation-2026-09-10.md) ve kök aile checklist’i esas alınır. Ürün/servis için genel shared modüle geçiş iptal edilmiştir; native API sözleşmesi yerel modüllerle korunur. Kühlturm Ensotek alt markasıdır; TR geçmiş verisi silinmeden public dil kapsamı DE/EN tutulur.

İlerleme bittikçe `[ ]` → `[x]` olarak işaretle.

---

## A) Branding — ensotek → kuhlturm

- [x] **Global rename**: `backend/src/` ve `admin_panel/src/` içinde `ensotek`/`Ensotek`/`ENSOTEK` geçen yerleri tara, kuhlturm'a uygun karşılığına çevir (kod, comment, log/error mesajları, identifier'lar)
- [x] **Swagger info** (`backend/src/app.ts`): `title: 'MOE Kompozit API'` veya `'Ensotek API'` → `'Kühlturm API'`; `description`, `version` güncelle
- [x] **Mail**: `backend/src/core/*-mail.ts` veya `packages/shared-backend/modules/mail` kullanımı — `from`, signature, branding güncelle
- [x] **Admin branding** (`admin_panel/src/app/(main)/admin/_components/`): header logo, site name, footer
- [x] **CLAUDE.md** (`admin_panel/CLAUDE.md`): "Ensotek Admin Panel" başlığı + "Ensotek marka renkleri" bölümü → Kühlturm
- [x] **Logo/favicon**: `admin_panel/public/` ve `frontend/public/` altında ensotek logoları kuhlturm logosuyla değiştirilir

## B) Locale — TR sil, DE + EN tut

- [x] **Frontend** (`frontend/src/`): `next-intl` config — supported `['de', 'en']`, default `de`. `src/i18n/`, `src/middleware.ts`, `next.config.ts` locale referansları
- [x] **Admin** `src/locale/tr.json` dosyasını sil
- [x] **Admin** locale options ve fallback'ler — `en.json` çevirileri TR içeriyorsa düzelt
- [x] **Backend** locale enum/list (örn. `src/_shared/locale.ts`, `common/middleware/locale.ts`) — supported `de,en`
- [x] **Seed SQL**: tablolardaki `locale='tr'` satırlarını kaldır

## C) Veritabanı seed (`backend/src/db/seed/sql/`)

- [x] **`site_settings`**: site name = Kühlturm, contact info, logo URL, brand colors, site_id
- [x] **`menu_items`**: kuhlturm navigation (DE+EN)
- [x] **`footer_sections`**: kuhlturm footer içerik
- [x] **`custom_pages`**: about, services, products, contact (DE+EN; ensotek içeriği kaldırılır)
- [x] **`categories` / `subcategories`**: kuhlturm ürün/kategori taksonomisi
- [x] **Default admin user**: `SEED_ADMIN_EMAIL` + bcrypt/argon2 hash ile seed
- [x] **Profile/seed adı**: seed scripti `--profile=ensotek` yerine `--profile=kuhlturm` veya `--profile=` (default)

## D) shared-backend entegrasyonu — Claude kapsamı

- [x] `backend/package.json`'a workspace dep ekle:
  ```json
  "@ensotek/shared-backend": "workspace:*"
  ```
- [x] **Codex kapsam notu**: `backend/src/modules` içinde tekrar modül üretimi/migrasyonu yapılmayacak; Claude `packages/shared-backend/modules` üzerinden ele alacak.
- Claude'a devredilen işler:
  - Faz 1: `auth`, `audit`, `health`, `siteSettings`, `_shared`
  - Faz 2: `categories`, `subcategories`, `customPages`, `menuItems`, `footerSections`, `gallery`, `storage`
  - Faz 3: `contact`, `mail`, `newsletter`, `notifications`, `library`, `references`, `review`, `telegram`, `products`
  - Referans pattern: `kompozit/backend/src/app.ts` + `routes/shared.ts` (slim ~80 src dosya)

## E) Marka palette & tema (admin_panel)

- [x] `src/app/globals.css`: `--logo-coral*` (ensotek) → kuhlturm renkleri (mavi/gri tonları?)
- [x] `src/styles/presets/*.css`: tema presetleri palette güncelle
- [x] `src/lib/preferences/theme.ts`: preset listesi
- [x] `package.json`: `generate:presets` scripti çalıştır

## F) Domain ve URL referansları

- [x] Source içinde hardcoded `ensotek.de` / `https://ensotek.de` araması → `kuhlturm.com`
- [x] SEO/OG tag defaults (frontend)
- [x] `sitemap.xml`, `robots.txt`
- [x] Mail template footer / copyright
- [x] `admin_panel/.env.example` ve `frontend/.env.example` URL'leri

## G) Frontend PM2 ecosystem

- [x] `kuhlturm/frontend/ecosystem.config.cjs` oluştur:
  - `name: 'kuhlturm-frontend'`
  - `cwd: '/var/www/Ensotek/kuhlturm/frontend'`
  - Uygun boş port ata (3025+)
  - Pattern: `kompozit/frontend/ecosystem.config.cjs` örnek
- [x] `frontend/package.json` scripts portunu güncelle

## H) Test ve smoke

- [x] `backend/scripts/` — varsa ensotek-isimli smoke tests kuhlturm'a uyarla
- [x] `admin_panel/scripts/` — i18n merge, theme generate

## I) Build & doğrulama (success criteria)

- [x] `cd backend && bun install && bun run build` — tip hatasız build
- [x] `cd backend && bun run dev` — port 8089'da Fastify ayağa kalkıyor
- [x] `cd backend && bun run db:seed` — DB schema + seed kuhlturm DB'sine yazılıyor
- [x] `cd admin_panel && bun install && bun run build`
- [x] `cd admin_panel && bun run dev` — port 3023'te Next.js, login ekranı
- [x] Admin → backend bağlantısı çalışıyor, seed admin user ile login OK
- [x] `cd frontend && bun run build` — tip hatasız
- [x] `cd frontend && bun run dev` — DE locale default, EN fallback çalışıyor
- [x] Swagger docs erişilebilir: `http://127.0.0.1:8089/documentation`

## J) Repo hijyen — bitirirken

- [ ] `project.portfolio.json` `status`: gerekiyorsa `in-development` → `live` (canlıya alındığında)
- [x] `README.md` güncel
- [ ] **Bu checklist'teki tüm kutucuklar [x]** olduğunda Kühlturm hazır
- [ ] `kuhlturm.com` canlıya alındığında: workspace `CLAUDE.md`'deki proje tablosu güncelle

---

## Notlar

- **DB schema kuralı**: `ALTER TABLE` yok — `0XX_*.sql` güncellenir + `db:seed:fresh`
- **`.env` dosyaları**: asla commit edilmez (`.gitignore` ile zaten engelli)
- **Workspace ortak paketler**: `Ensotek/packages/` — root `bun` workspace üzerinden erişilir
- **2026-05-23 doğrulama notu**: `backend`, `admin_panel` ve `frontend` build başarılı. `admin_panel` dev 3023'te `/auth/login` için HTTP 200 döndü. `frontend` dev 3025'te `/` → `/de`, `/de` ve `/en` için HTTP 200 döndü.
- **2026-05-23 DB doğrulama notu**: Yerel MySQL 3307'de `app@%` kullanıcısına `kuhlturm.*` full yetki verildi. `db:seed` fresh çalıştı; backend dev 8089'da MySQL bağlantısıyla ayağa kalktı; `/health`, `/documentation`, `/api/products`, `/api/services` ve seed admin login doğrulandı.
- **VPS deploy**: poly-repo migration tamamlandıktan sonra `.github/workflows/deploy.yml` (root Ensotek repo) ile manuel tetiklenir
