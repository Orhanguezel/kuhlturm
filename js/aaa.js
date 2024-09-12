(function() {
    // Orijinal addEventListener metodunu sakla
    var originalAddEventListener = EventTarget.prototype.addEventListener;

    // Yeni addEventListener metodu
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Sadece touchstart ve touchmove olayları için pasif ayarla
        if (type === 'touchstart' || type === 'touchmove') {
            // Eğer seçenekler belirtilmemişse
            if (typeof options === 'undefined') {
                options = {};
            }
            // Eğer boolean ise, nesneye çevir ve passive: true ekle
            if (typeof options === 'boolean') {
                options = {
                    capture: options,
                    passive: true
                };
            }
            // Eğer nesne ise passive: true ekle
            if (typeof options === 'object') {
                options.passive = true;
            }
        }
        // Orijinal addEventListener'ı çağır
        originalAddEventListener.call(this, type, listener, options);
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sadece touchstart ve touchmove olayları pasif hale getirildi.');
});
