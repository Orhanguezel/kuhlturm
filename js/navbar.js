(() => {
  'use strict';

  document.querySelector('#navbarSideCollapse').addEventListener('click', () => {
    document.querySelector('.offcanvas-collapse').classList.toggle('open');
  });
})();

document.addEventListener('DOMContentLoaded', function() {
  // Tüm öğelerdeki touchstart ve touchmove olay dinleyicilerini pasif hale getirme
  const addPassiveEventListener = (type) => {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const originalAddEventListener = el.addEventListener;
      el.addEventListener = function(eventType, listener, options) {
        if (eventType === type) {
          options = options || {};
          if (typeof options === 'boolean') {
            options = { passive: true };
          } else if (typeof options === 'object') {
            options.passive = true;
          }
        }
        originalAddEventListener.call(el, eventType, listener, options);
      };
    });
  };

  // touchstart ve touchmove olaylarını pasif hale getirme
  addPassiveEventListener('touchstart');
  addPassiveEventListener('touchmove');

  // Navbar linklerine tıklayınca menünün kapanmasını sağlayan kod
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
  const navCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Sayfa içi bağlantılar için ek kontrol
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Menü açıkken linke tıklanınca menüyü kapat
      if (navCollapse.classList.contains('show')) {
        navbarToggler.click(); // Menü'yü kapat
      }
    });
  });
});
