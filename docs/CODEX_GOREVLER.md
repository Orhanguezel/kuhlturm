# Kühlturm — Codex Görev Checklist'i

> kuhlturm/backend ve kuhlturm/admin_panel iskeletleri **ensotek_de'den klonlandı** (Claude Code, 2026-05-23). Aşağıdaki "derin dönüşüm" Codex tarafından tamamlanır. Detay bağlam: [`kuhlturm-codex-brief.md`](kuhlturm-codex-brief.md).

İlerleme bittikçe `[ ]` → `[x]` olarak işaretle.

---

## A) Branding — ensotek → kuhlturm

- [ ] **Global rename**: `backend/src/` ve `admin_panel/src/` içinde `ensotek`/`Ensotek`/`ENSOTEK` geçen yerleri tara, kuhlturm'a uygun karşılığına çevir (kod, comment, log/error mesajları, identifier'lar)
- [ ] **Swagger info** (`backend/src/app.ts`): `title: 'MOE Kompozit API'` veya `'Ensotek API'` → `'Kühlturm API'`; `description`, `version` güncelle
- [ ] **Mail**: `backend/src/core/*-mail.ts` veya `packages/shared-backend/modules/mail` kullanımı — `from`, signature, branding güncelle
- [ ] **Admin branding** (`admin_panel/src/app/(main)/admin/_components/`): header logo, site name, footer
- [ ] **CLAUDE.md** (`admin_panel/CLAUDE.md`): "Ensotek Admin Panel" başlığı + "Ensotek marka renkleri" bölümü → Kühlturm
- [ ] **Logo/favicon**: `admin_panel/public/` ve `frontend/public/` altında ensotek logoları kuhlturm logosuyla değiştirilir

## B) Locale — TR sil, DE + EN tut

- [ ] **Frontend** (`frontend/src/`): `next-intl` config — supported `['de', 'en']`, default `de`. `src/i18n/`, `src/middleware.ts`, `next.config.ts` locale referansları
- [ ] **Admin** `src/locale/tr.json` dosyasını sil
- [ ] **Admin** locale options ve fallback'ler — `en.json` çevirileri TR içeriyorsa düzelt
- [ ] **Backend** locale enum/list (örn. `src/_shared/locale.ts`, `common/middleware/locale.ts`) — supported `de,en`
- [ ] **Seed SQL**: tablolardaki `locale='tr'` satırlarını kaldır

## C) Veritabanı seed (`backend/src/db/seed/sql/`)

- [ ] **`site_settings`**: site name = Kühlturm, contact info, logo URL, brand colors, site_id
- [ ] **`menu_items`**: kuhlturm navigation (DE+EN)
- [ ] **`footer_sections`**: kuhlturm footer içerik
- [ ] **`custom_pages`**: about, services, products, contact (DE+EN; ensotek içeriği kaldırılır)
- [ ] **`categories` / `subcategories`**: kuhlturm ürün/kategori taksonomisi
- [ ] **Default admin user**: `SEED_ADMIN_EMAIL` + bcrypt/argon2 hash ile seed
- [ ] **Profile/seed adı**: seed scripti `--profile=ensotek` yerine `--profile=kuhlturm` veya `--profile=` (default)

## D) shared-backend entegrasyonu

- [ ] `backend/package.json`'a workspace dep ekle:
  ```json
  "@ensotek/shared-backend": "workspace:*"
  ```
- [ ] **Faz 1 — basit modüller** (yerel kopya yerine shared import):
  - [ ] `auth` (login, JWT)
  - [ ] `audit`
  - [ ] `health`
  - [ ] `siteSettings`
  - [ ] `_shared` (common types/helpers)
- [ ] **Faz 2 — içerik modülleri**:
  - [ ] `categories`, `subcategories`
  - [ ] `customPages`
  - [ ] `menuItems`, `footerSections`
  - [ ] `gallery`, `storage`
- [ ] **Faz 3 — etkileşim modülleri**:
  - [ ] `contact`, `mail`, `newsletter`, `notifications`
  - [ ] `library`, `references`, `review`
  - [ ] `telegram`
  - [ ] `products`
- [ ] Referans pattern: `kompozit/backend/src/app.ts` + `routes/shared.ts` (slim ~80 src dosya)

## E) Marka palette & tema (admin_panel)

- [ ] `src/app/globals.css`: `--logo-coral*` (ensotek) → kuhlturm renkleri (mavi/gri tonları?)
- [ ] `src/styles/presets/*.css`: tema presetleri palette güncelle
- [ ] `src/lib/preferences/theme.ts`: preset listesi
- [ ] `package.json`: `generate:presets` scripti çalıştır

## F) Domain ve URL referansları

- [ ] Source içinde hardcoded `ensotek.de` / `https://ensotek.de` araması → `kuhlturm.com`
- [ ] SEO/OG tag defaults (frontend)
- [ ] `sitemap.xml`, `robots.txt`
- [ ] Mail template footer / copyright
- [ ] `admin_panel/.env.example` ve `frontend/.env.example` URL'leri

## G) Frontend PM2 ecosystem

- [ ] `kuhlturm/frontend/ecosystem.config.cjs` oluştur:
  - `name: 'kuhlturm-frontend'`
  - `cwd: '/var/www/Ensotek/kuhlturm/frontend'`
  - Uygun boş port ata (3025+)
  - Pattern: `kompozit/frontend/ecosystem.config.cjs` örnek
- [ ] `frontend/package.json` scripts portunu güncelle

## H) Test ve smoke

- [ ] `backend/scripts/` — varsa ensotek-isimli smoke tests kuhlturm'a uyarla
- [ ] `admin_panel/scripts/` — i18n merge, theme generate

## I) Build & doğrulama (success criteria)

- [ ] `cd backend && bun install && bun run build` — tip hatasız build
- [ ] `cd backend && bun run dev` — port 8089'da Fastify ayağa kalkıyor
- [ ] `cd backend && bun run db:seed` — DB schema + seed kuhlturm DB'sine yazılıyor
- [ ] `cd admin_panel && bun install && bun run build`
- [ ] `cd admin_panel && bun run dev` — port 3023'te Next.js, login ekranı
- [ ] Admin → backend bağlantısı çalışıyor, seed admin user ile login OK
- [ ] `cd frontend && bun run build` — tip hatasız
- [ ] `cd frontend && bun run dev` — DE locale default, EN fallback çalışıyor
- [ ] Swagger docs erişilebilir: `http://127.0.0.1:8089/documentation`

## J) Repo hijyen — bitirirken

- [ ] `project.portfolio.json` `status`: gerekiyorsa `in-development` → `live` (canlıya alındığında)
- [ ] `README.md` güncel
- [ ] **Bu checklist'teki tüm kutucuklar [x]** olduğunda Kühlturm hazır
- [ ] `kuhlturm.com` canlıya alındığında: workspace `CLAUDE.md`'deki proje tablosu güncelle

---

## Notlar

- **DB schema kuralı**: `ALTER TABLE` yok — `0XX_*.sql` güncellenir + `db:seed:fresh`
- **`.env` dosyaları**: asla commit edilmez (`.gitignore` ile zaten engelli)
- **Workspace ortak paketler**: `Ensotek/packages/` — root `bun` workspace üzerinden erişilir
- **VPS deploy**: poly-repo migration tamamlandıktan sonra `.github/workflows/deploy.yml` (root Ensotek repo) ile manuel tetiklenir
