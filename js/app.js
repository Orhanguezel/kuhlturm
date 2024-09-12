$(document).ready(()=> {
    'use strict';
  
      var owl = $('.owl-carousel'),
          item,
          itemsBgArray = [], // to store items background-image
          itemBGImg;
    
      owl.owlCarousel({  
          items: 1,
          smartSpeed: 1000,
          autoplay: true,
          autoplayTimeout: 8000,
          autoplaySpeed: 1000,
          loop: true,
          nav: true,
          navText: false,
          onTranslated: function () {
              changeNavsThump();
          }
      });
    
      $('.active').addClass('anim');
    
      var owlItem = $('.owl-item'),
          owlLen = owlItem.length;
      /* --------------------------------
        * store items bg images into array
      --------------------------------- */
      $.each(owlItem, function( i, e ) {
          itemBGImg = $(e).find('.owl-item-bg').attr('src');
          itemsBgArray.push(itemBGImg);
      });
      /* --------------------------------------------
        * nav control thump
        * nav control icon
      --------------------------------------------- */
      var owlNav = $('.owl-nav'),
          el;
      
      $.each(owlNav.children(), function (i,e) {
          el = $(e);
          // append navs thump/icon with control pattern(owl-prev/owl-next)
          el.append('<div class="'+ el.attr('class').match(/owl-\w{4}/) +'-thump">');
          el.append('<div class="'+ el.attr('class').match(/owl-\w{4}/) +'-icon">');
      });
      
      /*-------------------------------------------
        Change control thump on each translate end
      ------------------------------------------- */
      function changeNavsThump() {
          var activeItemIndex = parseInt($('.owl-item.active').index()),
              // if active item is first item then set last item bg-image in .owl-prev-thump
              // else set previous item bg-image
              prevItemIndex = activeItemIndex != 0 ? activeItemIndex - 1 : owlLen - 1,
              // if active item is last item then set first item bg-image in .owl-next-thump
              // else set next item bg-image
              nextItemIndex = activeItemIndex != owlLen - 1 ? activeItemIndex + 1 : 0;
          
          $('.owl-prev-thump').css({
              backgroundImage: 'url(' + itemsBgArray[prevItemIndex] + ')'
          });
          
          $('.owl-next-thump').css({
              backgroundImage: 'url(' + itemsBgArray[nextItemIndex] + ')'
          });
      }
      changeNavsThump();
  });


  document.addEventListener('DOMContentLoaded', function() {
    // Tüm touchstart ve touchmove olay dinleyicilerini pasif hale getirme
    const makePassive = (type) => {
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            el.addEventListener(type, function(e) {}, { passive: true });
        });
    };

    makePassive('touchstart');
    makePassive('touchmove');
});