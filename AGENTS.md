# Kühlturm — Agent / Codex Girişi

Kühlturm B2B soğutma kulesi sitesi (DE + EN). Mimari: `ensotek_de`'den klonlanmış 3-uygulamalı yapı (frontend + backend + admin_panel), kendi veritabanı (`kuhlturm`).

## Önce oku

- **Proje özeti ve komutlar:** [`README.md`](README.md)
- **Codex görev checklist'i:** [`docs/CODEX_GOREVLER.md`](docs/CODEX_GOREVLER.md) ← öncelik bu
- **Klonlama bağlamı + derin dönüşüm rehberi:** [`docs/kuhlturm-codex-brief.md`](docs/kuhlturm-codex-brief.md)
- **Workspace kuralları:** `../CLAUDE.md`, `../AGENTS.md`

## Sıkı kurallar

- `ALTER TABLE` **yok** — `src/db/seed/sql/0XX_*.sql` güncellenir, `db:seed:*:fresh` ile DB sıfırdan kurulur.
- `.env` repoya commit edilmez (`.gitignore`). Örnek için `.env.example`.
- Stack/domain/servis değişikliği varsa önce `project.portfolio.json` güncellenir.

## Portlar

| Servis | Port |
|--------|------|
| kuhlturm-backend | 8089 |
| kuhlturm-admin-panel | 3023 |
| kuhlturm-frontend | (mevcut PM2 — frontend ecosystem.config.cjs yok, oluşturulacak) |

## Veritabanı

`kuhlturm` — bağımsız MySQL DB. Diğer projelerin DB'leriyle paylaşılmaz.
