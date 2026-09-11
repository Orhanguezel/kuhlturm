# Kühlturm canlı veri ve işletim kabulü — 10 Eylül 2026

Kühlturm, Ensotek alt markasıdır; sosyal yayıncı tek Ensotek hesabıdır. Public diller DE/EN. Ensotek.de DE/EN/TR kapsamı ayrı kalır.

| Bileşen | Canlı kaynak |
| --- | --- |
| API | `/var/www/Ensotek/kuhlturm/backend`, PM2 `kuhlturm-backend`, 8089 |
| Frontend | `frontend/.next/standalone/kuhlturm/frontend/server.js`, 3025 |
| Admin | PM2 `kuhlturm-admin-panel`, 3023 |
| DB | `kuhlturm_live`, yalnız bu DB’ye yetkili `kuhlturm_runtime` |
| Medya | `backend/uploads`, provider `local`, nginx `/uploads/` aynı dizin |
| Yapılandırma | Sunucudaki `backend/.env`; credential Git/rapora alınmaz |

Önceden iki backend `ensotek` DB’sini paylaşıyor, ürün/servis nginx yolları şema uyumsuzluğu nedeniyle DE API 8086’ya gidiyordu. Native ürün/servis modülleri Kühlturm’a port edildi; diğer modüller ortak paketi kullanır. `013_products_schema.sql` ve `070_services.sql` native sözleşmeyi izler. Genel services uyumluluk UPDATE’i kaldırıldı. Yeni/izole DB dışında fresh seed çalıştırılmaz.

Geçişte mevcut `ensotek` snapshot’ı yeni `kuhlturm_live` DB’sine alındı. Eski `kuhlturm` (5 eski teklif dahil) ve `ensotek` değiştirilmedi/silinmedi; eski kayıtlar arşivdir, güncel admin havuzuyla birleştiği iddia edilmez. Ortak geçmişin başlangıç kopyası her iki DB’de kalır; geçişten sonraki site kayıt/ayar değişiklikleri kendi DB’sindedir. On kritik iş tablosu geçiş anında birebir eşit doğrulandı. Geçiş sırasında yalnız Kühlturm mutasyonlarına kısa 503 koruması uygulandı, sonra kaldırıldı.

249 dosya bağımsız dizinde HTTP 200: 212 yerel dosya ve 37 Cloudinary kopyası. Cloudinary kayıtları yerel provider’a çevrildi; bir sitedeki silme diğer sitenin provider dosyasını silmez. Ürün/servis için 42 önceki API eşitlik kontrolü, dosya/yetki için 253 kontrol geçti. Yönetici okumaları 200, normal kullanıcı 403, anonim 401.

Özel yedek: `/var/backups/ensotek-kuhlturm-isolation-20260909` (0700). Ortak ve eski DB dump’ları, önceki/candidate env, medya eşlemesi ve cutover alt dizininde eski dist/nginx bulunur. Geri dönüş, önceki dist/env/nginx’i birlikte yükleyip `pm2 restart kuhlturm-backend --update-env`, `nginx -t` ve reload gerektirir. **Canlıya geçiş sonrası yeni kayıt oluştuysa geri dönüşten önce delta uzlaştırılmalıdır.** Eski DB’ye doğrudan dönmek yeni talepleri görünmez yapabilir.

Release kapıları: backend `bun run build`; frontend mevcut lint/build; gerçek ürün/servis DE/EN URL’leri ve kayıp slug 404; sitemap canonical/hreflang; 390 px CTA/odak; anonim/yetkisiz admin reddi. Backend normal RSS nedeniyle PM2 sınırı 512M’dir. Kanıtlar kökte `output/checklist-2026-09-09/isolation/` içindedir. Google indeks yakınsaması, mail teslimi ve gelecek dönem metrikleri bu teknik izolasyon kabulüne dahil değildir.
