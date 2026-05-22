# Kühlturm — Codex Brief

> Bağlam: kuhlturm/backend ve kuhlturm/admin_panel iskeletleri 2026-05-23'te
> `ensotek_de`'den kopyalandı (rsync; node_modules/uploads/.env hariç). Kritik
> configler (paket isimleri, portlar, ecosystem cwd, .env.example, DB adı)
> kuhlturm'a göre adapte edildi. **Aşağıdaki "ensotek → kuhlturm" derin
> dönüşümleri Codex tarafından tamamlanır.**

## ✅ Yapılanlar (mimar)

- `kuhlturm/backend/` ← ensotek_de/backend kopyası (430 src dosya)
- `kuhlturm/admin_panel/` ← ensotek_de/admin_panel kopyası (533 src dosya)
- `package.json` `name` alanları: `kuhlturm-backend`, `kuhlturm-admin-panel`
- `ecosystem.config.cjs`: yeni cwd (`/var/www/Ensotek/kuhlturm/{backend,admin_panel}`), yeni portlar (8089, 3023), yeni isimler
- `.env.example`: `DB_NAME=kuhlturm`, PORT=8089/3023, CORS kuhlturm.com, locale DE+EN
- `README.md` + `project.portfolio.json` kuhlturm'a uyarlandı

## ❌ Codex'in yapması gereken — "ensotek → kuhlturm" derin dönüşüm

### 1) Branding ve isimlendirme (backend + admin)

- Source içinde `ensotek`, `Ensotek`, `ENSOTEK` geçen yerler kuhlturm'a çevrilir
- Özellikle dikkat:
  - `backend/src/core/` — proje-spesifik utility'ler (varsa)
  - `admin_panel/CLAUDE.md` — "Ensotek Admin Panel", "Ensotek marka renkleri", `--logo-coral` palette → kuhlturm palette
  - `admin_panel/src/app/(main)/admin/_components/` — header/branding bileşenleri
  - Swagger info: `app.ts` içinde `'MOE Kompozit API'`/`'Ensotek API'` → `'Kühlturm API'`
  - Console log mesajları, error mesajları
  - Mail template'leri, e-posta from adresleri

### 2) Locale temizliği — TR kaldır, DE + EN tut

- **Frontend** (`kuhlturm/frontend/`): `next-intl` konfigürasyonu — supported locales: `['de', 'en']`. `src/i18n/` veya `src/middleware.ts` içinde locale listesi.
- **Admin panel** (`kuhlturm/admin_panel/`):
  - `src/locale/tr.json` silinir
  - `src/locale/de.json` + `src/locale/en.json` korunur; `en.json` çevirileri Türkçe içerik içeriyorsa düzeltilir
  - Locale options ve fallback'ler
- **Backend** (`kuhlturm/backend/`):
  - Locale enum/list nerede tanımlıysa (örn. `_shared/locale.ts`, `common/middleware/locale.ts`)
  - DEFAULT_LOCALE = `de`, supported = `de,en`

### 3) Veritabanı seed dosyaları

- `backend/src/db/seed/sql/0XX_*.sql` dosyaları içinde ensotek'e özgü seed verisi varsa kuhlturm'a göre düzenlenir:
  - `site_settings` (site name, contact info, logo URL, brand colors)
  - `menu_items` (navigation)
  - `footer_sections`
  - `custom_pages` (about, services, vb. — kuhlturm içeriği)
  - Default admin user (SEED_ADMIN_EMAIL)
  - Locale satırları: TR satırları kaldırılır, sadece DE + EN
- Şema değişikliği gerekirse: `ALTER TABLE` **yok** — yeni seed SQL dosyası eklenir, `db:seed:fresh` ile DB sıfırdan kurulur.

### 4) shared-backend entegrasyonu

ensotek_de henüz `packages/shared-backend` modüllerini büyük ölçüde kullanmıyor (eski monolitik mimari). kuhlturm da şu an aynı durumda. Sıralı migrasyon önerisi:

- Önce: `@ensotek/shared-backend` workspace dep eklenir (`package.json`):
  ```json
  "@ensotek/shared-backend": "workspace:*"
  ```
- Sonra şu modüller için yerel kopya yerine shared-backend import'una geçilir:
  `auth`, `audit`, `categories`, `contact`, `customPages`, `emailTemplates`,
  `footerSections`, `gallery`, `health`, `library`, `mail`, `menuItems`,
  `newsletter`, `notifications`, `products`, `references`, `review`,
  `siteSettings`, `storage`, `subcategories`, `telegram`, `theme`, `userRoles`,
  `_shared`
- `kompozit/backend` örnek alınabilir — slim pattern (~80 src dosya).

### 5) Marka palette ve tema (admin_panel)

`admin_panel/src/app/globals.css` ve `src/styles/presets/*.css`:

- ensotek coral palette (`--logo-coral` serisi) → kuhlturm marka renkleri
- `data-theme-preset` listesi gözden geçirilir
- Logo/favicon dosyaları (`public/`) kuhlturm logosuyla değiştirilir
- `admin_panel/CLAUDE.md` içindeki "Ensotek marka renkleri" bölümü güncellenir

### 6) Domain ve URL referansları (hardcoded)

Source içinde hardcoded `ensotek.de` / `https://ensotek.de` aramaları:
- SEO/OG tag varsayılanları
- Sitemap base URL
- robots.txt
- Mail template footer
- Hata mesajlarında veya footer copyright

### 7) Frontend için PM2 ecosystem (henüz yok)

`kuhlturm/frontend/ecosystem.config.cjs` oluşturulur. Pattern:

```js
module.exports = {
  apps: [{
    name: 'kuhlturm-frontend',
    cwd: '/var/www/Ensotek/kuhlturm/frontend',
    script: '/usr/local/bin/bun',
    args: 'run start',           // veya 'next start -p <PORT>'
    env: { NODE_ENV: 'production', HOSTNAME: '127.0.0.1', PORT: '<assign>' },
    // ... (kompozit/frontend ecosystem örneğine bak)
  }],
};
```

Frontend portu için boş bir port atanır (mevcutlar: 3010, 3011, 3020, 3021, 3022, 3023, 3024 — uygun: 3025 veya benzeri).

### 8) Smoke / test scriptleri

`backend/scripts/` veya `admin_panel/scripts/` altında ensotek-isimli smoke tests varsa kuhlturm'a göre kopyalanır/uyarlanır.

### 9) Test ve doğrulama

- `cd backend && bun install && bun run build` — tip hatasız build
- `cd backend && bun run dev` — port 8089'da Fastify ayağa kalkar
- `cd admin_panel && bun install && bun run dev` — port 3023'te Next.js
- Admin paneli backend'e bağlanır, login akışı çalışır

## Port haritası (referans)

| Servis | Port |
|--------|------|
| ensotek-backend | 8086 |
| ensotek-com-tr-backend | 8087 |
| kompozit-backend (dev/prod) | 8088 / 8186 |
| **kuhlturm-backend** | **8089** |
| ensotek-com-tr-frontend | 3010 |
| ensotek-frontend (de) | 3011 |
| kompozit-frontend | 3020 |
| ensotek-com-tr-admin-panel | 3021 |
| ensotek-admin-panel (de) | 3022 |
| **kuhlturm-admin-panel** | **3023** |
| kompozit-admin-panel | 3024 |

## Veritabanı

`kuhlturm` — bağımsız MySQL DB. Diğer projelerin DB'leriyle (`ensotek`, `kompozit`, vb.) hiç paylaşılmaz.
