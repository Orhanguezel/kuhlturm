$(document).ready(function() {
    const images = [
        "https://ensotek.com/upload/17/water-cooling-towers-su-sogutma-kuleleri.jpg",
        "https://ensotek.com/upload/17/ensotek-su-sogutma-kulesi-ensotek-water-cooling-towers.jpg",
        "https://ensotek.com/upload/17/tctp-12c-aydin-orme.jpg",
        "https://ensotek.com/upload/17/aves-yag-tctp-9b.jpg",
        "https://ensotek.com/upload/17/aves-yag-tctp-9b-dctp-9b.jpg",
        "https://ensotek.com/upload/17/aves-yag-mersin-tctp-9b-2.jpg",
        "https://ensotek.com/upload/17/adacal-kucuk.jpg",
        "https://ensotek.com/upload/17/24.jpg",
        "https://ensotek.com/upload/17/zer-salca-tctp-20b.jpg",
        "https://ensotek.com/upload/17/ctp-9c.jpg",
        "https://ensotek.com/upload/17/ctp-12c.jpg",
        "https://ensotek.com/upload/17/dctp-24c-benzerler.jpg",
        "https://ensotek.com/upload/17/dctp-24c.jpg",
        "https://ensotek.com/upload/17/dctp-30.jpg",
        "https://ensotek.com/upload/17/dsc04943.jpg",
        "https://ensotek.com/upload/17/hes-kablo-dctp-12-merdiven.png",
        "https://ensotek.com/upload/17/iran-cooling-tower-sogutma-kulesi.jpg",
        "https://ensotek.com/upload/17/greenpark-otel-2x-ctp-3c-mail.jpg",
        "https://ensotek.com/upload/17/ensotek-su-sogutma-kulesi-55.jpg",
        "https://ensotek.com/upload/17/eczacibasi-3xdctp-5c.jpg",
        "https://ensotek.com/upload/17/linde-gaz-gebze.jpg",
        "https://ensotek.com/upload/17/linde-gaz-tctp-26-1.jpg",
        "https://ensotek.com/upload/17/linde-gaz-tctp-26b-3.jpg",
        "https://ensotek.com/upload/17/orion-avm-tctp-9c.jpg",
        "https://ensotek.com/upload/17/plastifay-ctp-9.jpg",
        "https://ensotek.com/upload/17/sogutma-kulesi-24.jpg",
        "https://ensotek.com/upload/18/suudi-arabistan-sogutma-kulesi.jpg",
        "https://ensotek.com/upload/17/suudi-arabistan-su-sogutma-kulesi.jpg",
        "https://ensotek.com/upload/17/su-sogutma-kulesi.jpg",
        "https://ensotek.com/upload/17/su-sogutma-kulesi-gaziantep.jpg",
        "https://ensotek.com/upload/17/sogutma-kulesi-ctp-1.jpg",
        "https://ensotek.com/upload/17/sogutma-kulesi-bursa.jpg",
        "https://ensotek.com/upload/18/tctp-12c-aydin-orme-2.jpg",
        "https://ensotek.com/upload/18/20201016-141603.jpg",
        "https://ensotek.com/upload/18/tctp-24-cooling-tower.jpg",
        "https://ensotek.com/upload/18/tctp-24-sogutma-kulesi.jpg",
        "https://ensotek.com/upload/19/sogutma-kulesi-tctp-30.jpg",
        "https://ensotek.com/upload/19/cooling-towers-ensotek.jpg",
        "https://ensotek.com/upload/19/ensotek-cooling-tower-tctp-30.jpg",
        "https://ensotek.com/upload/18/adana-sogutma-kulesi-satisi.jpg",
        "https://ensotek.com/upload/18/cooling-tower-istanbul.jpg",
        "https://ensotek.com/upload/18/istanbul-sogutma-kulesi-imalati-ensotek.jpg",
        "https://ensotek.com/upload/18/kocaeli-sakarya-ctp-sogutma-kulesi-uretimi.jpg",
        "https://ensotek.com/upload/18/gaziantep-su-sogutma-kulesi-imalati.jpeg",
        "https://ensotek.com/upload/18/gaziantep-sogutma-kulesleri-satisi.jpeg",
        "https://ensotek.com/upload/18/yuksek-kaliteli-sogutma-kulesi.jpg"
    ];

    // LightSlider'ı başlatmadan önce resimleri ekle
    const $lightSlider = $('#lightSlider');
    images.forEach((image) => {
        $lightSlider.append(`<li data-thumb="${image}"><img src="${image}" class="lightslider" /></li>`);
    });

    // LightSlider'ı başlat
    $lightSlider.lightSlider({
        gallery: true,
        item: 1,
        loop: true,
        slideMargin: 0,
        thumbItem: 9, // 9 küçük resim göster
        adaptiveHeight: true, // Resimlerin boyutuna göre yüksekliği ayarla
        thumbMargin: 0, // Küçük resimler arasında mesafe olmasın
        onSliderLoad: function(el) {
            el.lightGallery({
                selector: '#lightSlider .lslide'
            });
        }
    });
});
