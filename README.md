# Kühlturm

Soğutma kulesi (Kühlturm) çözümleri için **kurumsal web sitesi**. Şu an frontend uygulamasından oluşur; kendi backend'i ve veritabanı planlanmaktadır.

🌐 Domain: kuhlturm.com

## Yapı

| Klasör | Açıklama | Stack | Durum |
|--------|----------|-------|-------|
| `frontend/` | Genel kullanıcı sitesi | Next.js 16, React 19, next-intl, React Query, Tailwind v4 | Aktif |
| `backend/` | REST API | — | Planlanıyor (kendi DB'si ile) |
| `admin_panel/` | Yönetim paneli | — | Planlanıyor |

## Kurulum & Çalıştırma

```bash
cd frontend && bun install && bun run dev
```

## Ortam Değişkenleri

`.env` dosyaları repoya **dahil değildir** (`.gitignore`). Örnek için `frontend/.env.example` kullanılır.

## Backend Notu

Kühlturm'a `Ensotek/packages/shared-backend` tabanlı **ince bir backend** ve ayrı bir veritabanı eklenecektir (kompozit / ensotek_com_tr ile aynı mimari yaklaşım). Eski 430 dosyalık monolit backend kopyalanmaz.

## Deploy

- **VPS:** `ssh vps-Ensotek` (Hostinger, Ubuntu)
- **Domain:** kuhlturm.com — nginx reverse proxy

## Ortak Paketler

`frontend/`, `Ensotek/packages/` altındaki ortak paketleri root `bun` workspace üzerinden kullanır.
