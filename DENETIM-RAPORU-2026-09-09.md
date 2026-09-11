# Kühlturm — kapsamlı site denetimi

**Tarih:** 9 Eylül 2026. **Hedef:** https://kuhlturm.com — DE + EN.
**Sonuç:** 21 doğrulanmış sorun grubu. Öncelik: veritabanı ayrımı, alt sayfa canonical’ları, açılmayan çözümler ve İngilizce arayüz.

Bu çalışma denetim ve raporlama kapsamındadır. Uygulama kodu, veri, Google ayarları ve canlı servisler değiştirilmedi; form, e-posta veya katalog talebi gönderilmedi. Mevcut çalışma ağaçlarında önceden bulunan değişiklikler korunmuştur.

Önceki `ensotek_de/docs/ensotek-de-master-aksiyon-plani.md`, `seo-gsc-duzeltme-plani.md`, `ensotek_com_tr/docs/FRONTEND_CHECKLIST.md` ve mevcut 9 Eylül SEO/GA4 kayıtları referans alındı. Aynı ana başlıklar kullanıldı: HTTP, sitemap, canonical/hreflang, SSR içerik, dil/marka, yapılandırılmış veri, dönüşüm, mobil kullanım, erişilebilirlik, performans ve işletim.

**Kanıt standardı:** “Doğrulandı” canlı yanıt/tarayıcı veya belirtilen kaynak kodla kanıtlanan bulgudur. “Açık doğrulama” tamamlanmamış bir kontroldür; hata sayısına dahil değildir. Sayfa sayıları aynı temel sorundan etkilenen URL sayılarıdır; ayrı hata sayısı değildir. Dört kontrollü olmayan-slug isteği taramaya dahildir.

## Ölçülen durum

| Kontrol | Sonuç |
|---|---|
| Sitemap | **68 URL**, ana URL’lerin tamamı HTTP 200 |
| Sitemap + bağlantı/hreflang taraması | **1.108 istek**; kalan kuyruk 0 |
| İlk HTTP dağılımı | 1.096 HTTP 200, 10 HTTP 404, 2 bağlantı timeout |
| Tekrar kontrol | İki timeout URL’si yeniden **200**; kalıcı erişim arızası sayılmadı |
| Gerçek bozuk bağlantı hedefi | **8**: altı `/services/...`, iki referans hizmet yolu; iki ek 404 kasıtlı test |
| Yanlış canonical | İlk geçişteki 1.096 başarılı isteğin **1.094**’ünde locale ana sayfası |
| İçerik bulunamadı + HTTP 200 | İlk geçişte 140; 140’ı tekrar denetlendi: **125 toparlandı, 15 sürdü** |
| Kalıcı boş sayfa kümesi | **13 gerçek adres + 2 kasıtlı legal test adresi** |
| Çeviri dosyaları | EN ve DE dosyalarındaki **337/337 metin aynı** |
| JSON-LD | İlk taramanın başarılı HTML yanıtlarında yok |
| Mobil Lighthouse | Performans **69**, erişilebilirlik **96**, iyi uygulamalar **100**, SEO **100** |
| LCP / FCP / TBT / CLS | **5,6 sn / 1,3 sn / 340 ms / 0** |
| TypeScript | Frontend + backend + admin panel: geçti |
| Canlı servis/DB | Üç PM2 süreci online; API health 200; backend DB adı **ensotek** |

Lighthouse 12.8.2, mobil simülasyon, tek koşu; iki site aynı yerel makinede eşzamanlı ölçüldü. Gerçek kullanıcı CWV/CrUX veya kesin hız kıyası değildir. Ana sayfa SEO puanı 100, alt sayfa canonical/discovery doğruluğunu kanıtlamaz.

## Doğrulanmış bulgular ve kabul kriterleri

### T01 — P0 — Canlı veritabanı, bağımsızlık doktrininin aksine ensotek.de ile ortak

`kuhlturm/backend/.env DB_NAME=ensotek`, `ensotek_de/backend/.env DB_NAME=ensotek`. Kühlturm portu 8089, ensotek.de 8086; ayrı proses ayrı DB anlamına gelmiyor. `AGENTS.md` ve README bağımsız `kuhlturm` DB iddia ediyor. Aynı gün GA4 QA belgesi de genel ayar güncellemesinin ensotek.de’yi etkilediğini, anahtarların marka önekiyle ayrılarak geri düzeltildiğini kaydetmiş.

**Etkisi:** Genel site ayarları ve içerik değişikliklerinin diğer siteyi etkileme riski; bağımsız seed/fresh işlemi talimatı mevcut runtime üzerinde uygulanamaz.

- [ ] Gerçek site/DB sahipliği kararı ve veri envanteri çıkar; ortak kalacaksa kapsam izolasyonu, ayrılacaksa yedekli ve doğrulanabilir migration planı hazırla. Denetim kapsamında migration yapılmadı.
- [ ] Doküman, runtime, seed hedefi ve kabul kontrolü aynı mimariyi anlatsın; siteye özgü bir ayar değişikliğinin diğer siteyi etkilemediği izole ortamda kanıtlansın.

### T02 — P0 — Alt sayfa canonical ve hreflang’ları ana sayfaya işaret ediyor

Örnek `/de/product/offene-kuehltuerme-einzelzelle-ctp-serie` canonical: `https://kuhlturm.com/de`. `/en/contact` canonical: `https://kuhlturm.com/en`. İlk başarılı 1.096 yanıtın 1.094’ünde kendine canonical yok; yalnız iki ana sayfa doğru.

**Kök neden:** `frontend/src/app/[locale]/layout.tsx:74-76` sabit locale ana sayfasını canonical ve dil alternatifi yapıyor; alt sayfaların metadata’sı bunu ezmiyor. Alt sayfa hreflang’larının var olması yeterli değil: başka dilde aynı içerik yerine ana sayfaya gidiyor.

- [ ] Statik/dinamik her indexlenebilir sayfada gerçek path canonical; gerçek içerik çevirileriyle karşılıklı alternatifler. Ana sayfa mirası kaldırılsın.

### T03 — P0 — Çözüm detayları yanlış API adresi nedeniyle içeriksiz

DE/EN liste sayfalarındaki sekiz çözüm detayı tekrar kontrolde de `Keine Lösungen gefunden` ile 200. Örnek `/en/solutions/industrial-cooling-solutions`.

**Kanıtlanan veri yolu:** `solutions/[slug]/page.tsx` → `@ensotek/core getCustomPageBySlug` → `packages/core/src/endpoints/api-endpoints.ts:67` **`/custom_pages/by-slug/...`**. Bu istek **404**; gerçek **`/custom-pages/by-slug/industrial-cooling-solutions?locale=en` 200**, İngilizce içerik mevcut. Helper ayrıca `language` gönderiyor; gerçek endpoint `locale` bekliyor. `language=en` ile yapılan denemede yanıt `locale=tr`, `locale=en` ile İngilizce geldi.

- [ ] Hem endpoint hem locale sözleşmesi düzelsin; sekiz liste hedefi gerçek başlık/gövdeyle açılsın, hata boş veri diye yutulmasın.

### T04 — P1 — Eksik veri ve API arızası HTTP 200 “bulunamadı” sayfasına dönüşüyor

`legal/[slug]`, `references/[slug]`, `solutions/[slug]` yolları boş sonuçta JSX döndürüyor; `notFound()` veya arıza ayrımı yok. Kasıtlı `/de/legal/codex-audit-nonexistent-20260909` ve EN karşılığı **200 + index,follow**.

İlk geçişte **140** boş-200 görüldü. Daha düşük hızda yeniden taramada **125 referans sayfası toparlandı**, **15 adres** boş kaldı. Dolayısıyla “140 kalıcı bozuk içerik” denemez. Ancak geçici fetch hatasının indexlenebilir boş gövdeye dönüşmesi kaynakta ve canlıda doğrulandı. İlk geçişin arıza nedeni (yük, upstream bağlantı veya başka neden) bu tur kesinleştirilmedi.

- [ ] Gerçek yokluk ile timeout/5xx ayrı ele alınsın; yokluk gerçek 404, arıza uygun durum/retry politikası üretsin. Geçici backend hatası indexlenebilir boş sayfa üretmesin.

### T05 — P1 — İngilizce arayüz dosyası bütünüyle Almanca

`frontend/public/locales/en.json` ve `de.json` içindeki **337 metnin tamamı aynı**. `/en/contact` ve `/en/offer` Almanca; blog/team/solutions ekranında İngilizce veriyle Almanca arayüz karışıyor. Statik `generateMetadata` içinde de Almanca metinler mevcut (`contact/page.tsx` örneği).

- [ ] EN çeviri seti tamamlanmalı; metadata, buton, form hatası, tarih ve menüler İngilizce olmalı. Aynı teknik terimlerin eşit kalması normaldir; kabul içerik bazında yapılmalı.

### T06 — P1 — İngilizce footer dört çalışmayan yasal sayfaya götürüyor

`/en/legal/cookie-richtlinie`, `/en/legal/datenschutzerklaerung`, `/en/legal/impressum-rechtliche-hinweise`, `/en/legal/informationspflicht` tekrar kontrolde **200 ama içerik yok**. Footer Almanca slug’ı EN önekiyle kopyalıyor.

- [ ] Her footer öğesi mevcut İngilizce içerik kimliğine bağlansın; karşılık yoksa yanıltıcı link üretilmesin. İçerik + 200 + doğru canonical birlikte doğrulansın.

### T07 — P1 — Ana sayfa ve referanslardan sekiz bozuk hizmet hedefi

Her iki ana sayfada altı slider linki `/services/{site-survey-engineering,maintenance-repair,automation-scada,spare-parts-components,modernization-retrofit,engineering-support}` adresine gidiyor; locale yönlendirmesinden sonra **404**. Gerçek route `/service/...`.

Ek hedefler `/de/service/regelmaessige-wartung-reparatur-kuehltuerme` ve `/en/service/cooling-tower-maintenance-repair` 404. İlk taramada bu linkler sırasıyla **56 ve 68** kaynak sayfada bulundu; geçici boş sayfalar nedeniyle bu sayılar tam veri tabanı kapsamını temsil etmeyebilir.

- [ ] Slider ve referans içerik linklerini gerçek service slug’ına, kullanıcının diliyle bağla. Eski dış URL’ler için içerik bazlı yönlendirme kararı ver; tüm sekiz hedefi ve kaynaklarını yeniden tara.

### T08 — P1 — Sitemap API limit hataları nedeniyle birçok içerik türünü dışarıda bırakıyor

`src/app/sitemap.ts:fetchSlugs` bütün endpoint’lere `limit=500&is_published=true` yolluyor. Canlı `/api/services`, `/api/library`, `/api/custom-pages` bu sorguda **400**; hata `[]` oluyor. Sitemap 30 statik + 8 ürün + 30 proje = 68 URL. Hizmet/kütüphane/custom-page detayları yok. Referans, yedek parça, ekip, blog ve haber detaylarının kapsamı da kaynakta eksik.

- [ ] Endpoint bazında sözleşme + sayfalama uygula; sitemap’in kapsamını yayımlanmış ve gerçekten indexlenebilir içerikle karşılaştır. Kırık/boş URL’leri sırf sayı artsın diye ekleme.

### T09 — P2 — Sitemap locale gözetmeden aynı slug kümesini iki dile basıyor

Slug listeleri döngü dışında ve locale gönderilmeden çekiliyor. Örneğin EN ürün sitemap adreslerinde Alman slug’ları var; İngilizce iç linklerden başka slug’lar keşfediliyor. Slug’ın Almanca olması tek başına hata değildir; içerik kimliği ve canonical eşlemesi yapılmadan aynı kümenin kopyalanması kaynak hatasıdır.

- [ ] Her içerik kimliği için gerçek DE/EN adresleri üret; liste linki, dil geçişi ve sitemap aynı eşlemeyi kullansın.

### T10 — P2 — Sitemap lastmod içerik değişimini yansıtmıyor

68 URL’nin tamamı aynı `2026-09-09T17:30:19.897Z` lastmod değerini taşıyor. Kaynak her üretimde `new Date()` atıyor; içerik güncellenmese de tarih yenileniyor.

- [ ] İçeriğin gerçek `updated_at` değeri kullanılsın; bilinmiyorsa lastmod uydurulmasın. İçerik değişmeden iki üretimde tarih sabit kalsın.

### T11 — P1 — www/non-www host tek yönlendirmede birleşmiyor

`https://www.kuhlturm.com/de` ve `https://kuhlturm.com/de` doğrudan **200**; www isteğinde redirect zinciri boş. Nginx aynı server_name içinde iki host’u kabul ediyor. HTTP → HTTPS 301 çalışıyor. Host canonical’ı ayrı kontrol edildi (`host-check.json`); buna rağmen duplicate host erişimi sürüyor.

- [ ] Tercih edilen host açıkça seçilsin; diğer host path/query koruyan tek 301/308 ile ona gitsin. Runtime/build env, sitemap ve canonical aynı host’u kullansın.

### T12 — P1 — Yapılandırılmış veri yok

İlk taramanın başarılı HTML yanıtlarında `application/ld+json` bulunmadı; ana sayfa ve gerçek ürün detayı dahil. Organization/WebSite/Product/Breadcrumb türleri görünmüyor.

- [ ] Doğrulanmış şirket ve ürün verisinden uygun schema üret; görünür içerikle tutarlı olsun. Yorum, fiyat ve sertifika bilgisi uydurulmasın.

### T13 — P2 — llms.txt erişilemiyor

`/llms.txt` → `/de/llms.txt` → **404**. Önceki denetimin GEO kapsamındaki bilgi dosyası burada yok. Bu bir Google indeksleme zorunluluğu veya görünürlük garantisi değildir.

- [ ] Kullanılacaksa şirket rolü, ürün/hizmet ve gerçek kaynak URL’leriyle kısa, güncellenebilir dosya oluştur; root’tan 200 dönsün.

### T14 — P1 — Mobil hero içeriği ve teklif CTA’sı kesiliyor

390×844 görüntüde ilk slayt metni alt sınıra taşıyor, ana teklif düğmesi görünmüyor; sağ sabit araç çubuğu metni örtüyor. Kaynak `HeroSliderClient.tsx:110` slayta `clamp(520px,65vw,760px)` yükseklik veriyor, üst kapsayıcı `overflow-hidden`; mobilde 240 px görsel, başlık, açıklama ve CTA toplamı sığmıyor.

Canlı geometri: hero alt sınırı **593 px**, ilk CTA üst/alt sınırları **610,5–660,1 px**. Düğme kesen kapsayıcının bütünüyle dışında kalıyor; [geometri kanıtı](docs/audit/2026-09-09/hero-geometry.json).

- [ ] Mobilde içerik yüksekliği/yerleşimi tüm slaytlarda CTA’yı görünür kılsın; sağ araç çubuğu metin ve kontrol üstüne gelmesin. 390 px ve daha dar ekranlarda gerçek geometri + dokunma testi yap.

### T15 — P2 — Marka adı ile gösterilen logo/içerik tutarsız

Header görselinin erişilebilir adı `Kühlturm`, fakat görselde **ENSOTEK** logosu var; hero da Ensotek bina görseli. Yasal metinler Ensotek sitesinden söz ediyor. Aynı aile şirketinin logosunu kullanmak başlı başına yanlış değildir; ancak README/AGENTS bağımsız marka kurulumunu tamamlandı gösterirken canlı kimlik bu ayrımı anlatmıyor.

- [ ] Alan adının rolü (Ensotek alt markası / kategori portalı / bağımsız marka) belirlenip logo, erişilebilir isim, şirket anlatısı, sosyal bağlantı ve ayarlar tutarlı hale getirilsin.

### T16 — P1 — Mobil görsel yükleme ve JavaScript maliyeti yüksek

Tek koşu **LCP 5,6 sn**, **TBT 340 ms**, main-thread çalışma **9 sn**, JS execution **6,4 sn**. LCP hero görseli yüklenme süresi yaklaşık **4,46 sn** (%80). Görsel istek önceliği high değil. Kök doküman yanıtı Lighthouse’da yaklaşık 750 ms.

- [ ] Hero görsel boyutu/teslimi ve öncelik, slider çalışma yükü ve SSR veri yolu ölçülerek iyileştirilsin. Aynı mobil profil tekrar ölçülsün; gerçek kullanıcı verisi ayrı izlensin.

### T17 — P2 — Form kontrolleri erişilebilir etiketle bağlı değil

`/en/contact` ve `/en/offer` örneklerinde altışar kontrolün ilişkili label veya aria-label’ı yok (gizli tip alanlar hariç; sayımın ayrıntısı `browser.json`). Görünür başlıklar her zaman input’a bağlı değil.

- [ ] Gerçek kullanıcı alanları `label htmlFor / id` ile ilişkilensin; honeypot ayrı ve erişilebilir akış dışında değerlendirilsin. Ekran okuyucu/klavye kontrolü yap.

### T18 — P2 — Slider dokunma hedefleri çok küçük

Lighthouse `target-size` başarısız: ürün slider göstergeleri 8×8 ve 24×8 px, komşu hedef aralığı yetersiz. Görsel nokta küçük kalabilir; tıklama alanı büyütülmeli.

- [ ] Yeterli hit-area ve aralık sağla; mobil gerçek dokunma ve erişilebilirlik kontrolü geçsin.

### T19 — P1 — Analitik çerezleri tercih verilmeden yazılıyor

Yeni denetim tarayıcısında bir onay seçilmeden GA4 `G-KXDKCDY0ET` yüklendi; `_ga` ve `_ga_KXDKCDY0ET` oluştu. Kullanıcıya tercih akışı gözlenmedi. Bu teknik gözlemdir; hukuki ihlal hükmü değildir.

- [ ] Hedef pazara uygun tercih/ölçüm akışı belirlensin; kabul/red durumunda ağ ve cookie davranışı doğrulansın.

### T20 — P2 — İki ana sayfada H1 yok

DE/EN ana sayfalarında hero başlıkları H2; H1 yok. Alt sayfalardaki geçici boş yanıtlar bu bulguya katılmadı.

- [ ] Sayfanın ana konusunu anlatan tek H1 sağla; slider’ın bütün başlıklarını H1’e dönüştürme.

### T21 — P2 — Repo işletim ve kalite belgeleri güncel değil

AGENTS bağımsız DB, oluşturulacak frontend ecosystem ve eski port durumu anlatıyor; canlı DB ortak ve ecosystem mevcut. `docs/CODEX_GOREVLER.md` marka/locale dönüşümünü tamamlandı işaretliyor; T05/T15 bunu karşılamıyor. `frontend/package.json` `next lint` komutu gerçek çalıştırmada `Invalid project directory .../frontend/lint` hatası veriyor.

- [ ] DB/servis ve tamamlanma iddiaları canlı kanıtla güncellensin; lint gerçek komutla çalışsın. Canonical, API path/locale, soft-404 ve mobil CTA için anlamlı release kontrolleri oluşturulsun.

## İçerik ve ticari güven için açık işler

Aşağıdakiler kesinleşmiş hata sayısına dahil değildir:

- **Impressum içeriği:** Çalışan DE sayfası genel kullanım/telif/bağlantı metni; tüzel unvan, yetkili, kayıt ve şirket kimliği ayrıntıları sayfa gövdesinde yok. Footer adresi mevcut. Sorumlu işletmenin gerçek bilgileri toplanıp içerik tamamlanmalı; bu rapor hukuki yeterlilik değerlendirmesi yapmaz.
- **Referans derinliği:** Birçok referans detayında kısa, birbirine benzer sektör/şirket metni var. Logo listesi ve geçmiş çalışma ilişkisi; ölçülmüş kapasite, teslim kapsamı veya vaka kanıtının yerine geçmez. Gerçek vaka belgeleri eklenmeli. İlk geçişte boş görünen 125 sayfa daha sonra açıldığı için “referanslar silinmiş” denemez.
- **Alan adı rolü / kopya içerik:** Aynı DB ve ortak marka içeriği doğrulandı; iki sitenin tam gövde envanteri karşılaştırılmadı. Denenen ensotek.de ürün sayfası yalnız `Wird geladen...` SSR gövdesi verdiği için “iki site birebir aynı” sonucu yazılmadı.
- **Yorumlar ve deneyim iddiası:** İsimli müşteri yorumları ve 40+ yıl iddiası için kaynak/izin/kapsam doğrulaması gerekir; bu tur sahte oldukları kanıtlanmadı.
- **Dönüşüm:** Kaynakta başarılı teklife bağlı doğrudan `generate_lead` bulunmadı. Mevcut GA4 QA notu yalnız page_view kurulumunu doğruluyor. Sunucu event’i, GA4 kabulü ve gerçek kayıt ilişkisi bu tur kontrol edilmedi; kesin dönüşüm yokluğu iddiası yok.
- **GSC:** 9 Eylül önceki kaydındaki son 28 gün 1 tıklama / 101 gösterim tarihli bağlamdır. Bu tur Google API’leri yeniden çağrılmadı; yeni indeksleme oranı üretilmedi.
- **Teslim ve güvenlik kapsamı:** Form/mail/katalog gönderimi ve oturumlu admin işlemi yapılmadı. Yetki/penetrasyon taraması, tüm statik dosyalar ve gerçek kullanıcı CWV tamamlanmış sayılmaz.

## Sağlam bulunanlar

- Üç PM2 servisi online, public API health 200. Eski restart sayıları güncel çökme kanıtı diye sunulmadı.
- 68 sitemap ana adresi 200; rastgele normal catch-all slug 404.
- Tek GA4 kimliği `G-KXDKCDY0ET` gözlendi; önceki yanlış Ensotek GA kimliği bu browser örneğinde yok.
- CSS örneklerinde gzip çalışıyor; mobil belge genişliği 390 px ve yatay sayfa taşması yok. Hero kesilmesi ayrı yerleşim sorunudur.
- Altı uygulamanın üçü bu repoda olmak üzere tüm TypeScript kontrolleri geçti; bu SEO/dil doğruluğu kanıtı değildir.

## Uygulama sırası

1. T01 için mimari/DB gerçeğini sabitle; T02–T03 canonical ve çalışmayan veri yolunu düzelt.
2. T04–T08: gerçek 404/arıza ayrımı, EN içerik, footer/slider bağlantıları, sitemap kapsamı.
3. T09–T12: dil eşlemeleri, lastmod, host birleştirme, schema.
4. T14/T16/T19: mobil CTA, performans ve tercih davranışı.
5. T13/T15/T17/T18/T20/T21: kalan içerik/erişilebilirlik/işletim işleri.

**Kapanış koşulu:** Her bulgu gerçek hedef URL/akışta tekrar test edilmeli. Tek bir başarılı build veya ana sayfa Lighthouse puanı tüm site kabulü yerine geçmemeli.

## Kanıt dosyaları

- [Özet ve URL kümeleri](docs/audit/2026-09-09/summary.json), [1.108 URL crawl](docs/audit/2026-09-09/crawl.json)
- [140 boş yanıt tekrar kontrolü](docs/audit/2026-09-09/soft404-rechecks.json), [timeout/örnek tekrarları](docs/audit/2026-09-09/rechecks.json)
- [Çözüm kök nedeni](docs/audit/2026-09-09/solution-root-cause.json), [locale parametresi](docs/audit/2026-09-09/locale-api-check.json)
- [API ve zincirler](docs/audit/2026-09-09/endpoint-checks.json), [host kontrolü](docs/audit/2026-09-09/host-check.json), [sitemap](docs/audit/2026-09-09/sitemap.xml)
- [Tarayıcı](docs/audit/2026-09-09/browser.json), [Lighthouse](docs/audit/2026-09-09/lighthouse-mobile.json)
- [Mobil hero](docs/audit/2026-09-09/home-mobile.png), [İngilizce iletişim ekranı](docs/audit/2026-09-09/contact-mobile.png), [masaüstü](docs/audit/2026-09-09/desktop.png)
- [Runtime DB/PM2](docs/audit/2026-09-09/runtime-summary.json), [TypeScript](docs/audit/2026-09-09/typecheck-summary.json), [lint](docs/audit/2026-09-09/lint.txt)
