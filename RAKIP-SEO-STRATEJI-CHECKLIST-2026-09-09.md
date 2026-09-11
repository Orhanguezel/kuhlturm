# Kühlturm — rakip, SEO ve içerik çalışma kaydı

Tarih: 9 Eylül 2026. Tenant: `kuhlturm`. Site: https://kuhlturm.com/de. Hedef: Almanya B2B; DACH genişlemesi servis/teslimat kapsamı doğrulandıktan sonra.

**9 Eylül ek denetimi:** [Kapsamlı site denetimi](DENETIM-RAPORU-2026-09-09.md) tamamlandı: 21 doğrulanmış sorun grubu, 1.108 URL taraması, tekrar kontrolleri ve mobil/masaüstü kanıtları. Öncelikler: canlı ortak DB gerçeği, alt sayfa canonical/hreflang, yanlış API yoluyla boş kalan çözümler ve tamamen Almanca EN arayüz. Bu denetimde düzeltme veya deploy yapılmadı.

## Canlıda tamamlananlar

- [x] Doğru tenant, web adresi, GSC `https://kuhlturm.com/` ve GA4 property `553360294` doğrulandı.
- [x] Rakip keşfi: 6 Almanca ticari sorgu, 120 gerçek Brave sonucu, durum `ok`.
- [x] Rakip analizi: 5 web sitesi ve 4 resmi-site kaynaklı sosyal profil; toplam 9 kayıt ve 9 araştırma notu.
- [x] Almanca strateji revizyon 1: dört içerik ekseni, toplam %100 dağılım, aylık web planı ve sekiz sonraki adım.
- [x] Kaydedilen bilgiler panelin kullandığı okuma fonksiyonlarıyla canlı DB'den tekrar doğrulandı.

Keşif koşusu: `0da4cd93-c1a1-4dcb-8b8d-cf7ac3456793`. Sorgular: Kühlturm Hersteller; geschlossener Kühlturm Industrie; GFK Kühlturm; Kühlturm Wartung Sanierung; Kühlturm Füllkörper Ersatzteile; Kühlturm Auslegung Kühlleistung. Brave sonuçları Google sırası değildir; mevcut collector Almanya konumunu sabitlemiyor.

## Takip listesi

| Şirket | Resmi kaynak | Sosyal takip |
|---|---|---|
| GOHL-KTK | https://www.gohl-ktk.de/ | LinkedIn gohl-ktk; Instagram gohl_ktk |
| CTS Cooling Tower Solutions | https://cts-cooling.com/ | Doğrulanmış profil eklenmedi |
| RCS Kühltürme Deutschland | https://kuehltuerme-deutschland.de/ueber-uns/ | Doğrulanmış profil eklenmedi |
| coolconcept | https://coolconcept.de/leistungen/kuehlturmtechnik/ | LinkedIn coolconcept-gmbh; Instagram coolconcept_gmbh |
| Torraval | https://www.torraval.com/de/kuehltuerme/ | Doğrulanmış profil eklenmedi |

Sosyal profil kimliği resmi site bağlantısından doğrulandı; gönderi örneklemi, takipçi ve etkileşim analizi henüz yapılmadı. RCS'nin çoğul `kuehltuerme-deutschland.de` alan adı ile coolconcept'in tekil `kuehlturm-deutschland.de` sitesi karıştırılmamalı. Ensotek aile siteleri bağımsız rakip değildir.

## Search Console başlangıcı

API başarılı, errors boş. Son dönem 10 Ağustos–6 Eylül 2026; önceki dönem 13 Temmuz–9 Ağustos.

| Ölçüm | Son 28 gün | Önceki 28 gün |
|---|---:|---:|
| Tıklama | 1 | 0 |
| Gösterim | 101 | 156 |
| CTR | %0,99 | %0 |
| Ortalama konum | 22,89 | 35,62 |

Veri hacmi çok düşük; ortalama konumdaki iyileşme büyüme kanıtı değildir. Görünen sorgu satırlarında tıklama yok; toplam bir tıklama herhangi bir sorguya atfedilemez. `kühlturm` 19 gösterim/56,68 konum; `kühlturm automation` 6/4,83; `kühlturm automatisierung` 6/18,33. Öncelikler hacim tahmini değil, erken teknik konu sinyalidir.

## Teknik ve içerik takip işleri

- [ ] **P0 — Marka ayrımı:** GSC route'u tenant adını otomatik marka terimlerine ekliyor (`marketing/routes.ts`). Genel kategori sözcüğü `kuhlturm` yanlışlıkla markalı sayılabilir. Bu raporun doğrudan API çağrısında yalnız `ensotek` marka terimi kullanıldı. Panelin marka/markasız dağılımı ayrı düzeltmeye kadar güvenilir KPI kabul edilmemeli.
- [ ] **P0 — Dil/URL envanteri:** GSC'de kök, dil öneksiz, `/de/` ve `/en/` URL'ler var. Güncel HTTP zinciri, canonical, hreflang, sitemap ve iç linkleri URL bazında kontrol et. Geçmiş GSC görünümü tek başına güncel hata kanıtı değil.
- [ ] **P0 — Alan adı rolü:** Ensotek.de ile paylaşılan Almanca kaynak içeriğini envanterle; aynı arama niyetini kopya sayfalarla çoğaltmadan önce iki sitenin rolünü belirle.
- [ ] **P1 — Hafta 1:** Mevcut Automation/SCADA içeriğinin Almanca sürümünü, ürün ilişkisini ve teknik teklif çağrısını geliştir.
- [ ] **P1 — Hafta 2:** Açık/kapalı kule seçimi rehberi; debi, giriş/çıkış sıcaklığı ve tasarım şartlarını kapsayan teklif girdileri.
- [ ] **P1 — Hafta 3:** Bakım/revizyon teklifi için gerekli mevcut tesis bilgileri rehberi.
- [ ] **P1 — Hafta 4:** Dolgu, damla tutucu ve nozul siparişinde model/ölçü tanımlama rehberi.
- [ ] **P1 — Dönüşüm:** Kaydı başarılı teknik teklif talebini tekil `generate_lead` ile ölç; telefon tıklamasını ayrı tut. Şu an dönüşüm kurulumu doğrulanmadı.
- [ ] **Sosyal:** Sitedeki ortak Ensotek hesaplarının sahibi/yayıncısı ve Almanca içerik payı belirlenmeli. Tenant sosyal scope'u boş; hesap kopyalanmadı veya etkinleştirilmedi.
- [ ] **28 günlük değerlendirme:** Almanca ticari sorgular, ürün/servis hedef sayfaları ve nitelikli talepler; önce başlangıç ölçümü, sonra hedef.

İçerik payları: seçim/hesaplama %35, bakım/modernizasyon %30, komponent/otomasyon %20, doğrulanmış proje/üretim %15. Öneri: ilk ay iki mevcut sayfa revizyonu + iki teknik rehber taslağı; LinkedIn haftada iki, Instagram haftada bir taslak ancak hesap kararı sonrası. Bu çalışma makaleleri veya gönderileri üretmedi/yayımlamadı/zamanlamadı.

## Kanıt ve tekrar çalıştırma

Bu repo: `docs/seo/2026-09-09/{gsc,discovery,public-research,verified}.json`.
Tanitio repo: `reports/kuhlturm-2026-09-09/package.json`, `backend/scripts/complete-kuhlturm-competitor-workspace.ts`, `docs/qa/kuhlturm-2026-09-09/`.
Script başlangıç kurulumudur; strateji mevcutsa üzerine yazmayı reddeder. Sonraki değişikliklerde mevcut revizyon korunarak güncelleme yapılmalı.

Canlıda yalnız tenant verileri eklendi; kod deployu veya PM2 restart yapılmadı. Doğrulama backend okuma fonksiyonlarıyla yapıldı; oturumlu tarayıcı görsel kontrolü yapılmadı.
