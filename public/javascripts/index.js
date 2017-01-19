/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
  [
    'jquery'
    , 'common'
    ,'swiper'
    //,'mb_player'
    ,'fastclick'
  ],
  function ($, Common) {
    console.info('index page');

    // $(".player").mb_YTPlayer();

	  var mySwiper = new Swiper ('.swiper-container', {
		  direction: 'horizontal',
		  loop: true,
		  speed: 1000,
		  centeredSlides: true,
		  autoplayDisableOnInteraction: false,
		  effect : 'coverflow',
		  autoplay : 6000,
		  // parallax : true,
		  paginationClickable: true,
		  // spaceBetween: 0,

		  // If we need pagination
		  pagination: '.swiper-pagination',

		  // Navigation arrows
		  nextButton: '.swiper-button-next',
		  prevButton: '.swiper-button-prev'

		  // And if we need scrollbar
		  //scrollbar: '.swiper-scrollbar',
	  });




     // var
     // _body = $('body'),
     // _nav_section = $('.navigation_section'),
     // _con_section = $('.content_section');
     //
     // $('.btn_nav').bind('click', function () {
     //    if(_body.hasClass('open_nav')){
	    //     _nav_section.removeClass('col-md-2').addClass('blind');
	    //     _con_section.removeClass('col-md-10').addClass('col-md-12');
	    //     _body.removeClass('open_nav').addClass('close_nav');
     //    }else{
	    //     _nav_section.removeClass('blind').addClass('col-md-2');
	    //     _con_section.removeClass('col-md-12').addClass('col-md-10');
	    //     _body.removeClass('close_nav').addClass('open_nav');
     //    }
     //   return false;
     // });

     // todo cookie에 저장하여 사용할 수 있도록 한다.

  }); // end of func