/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
  [
    'jquery'
    , 'common'
    ,'fastclick'
  ],
  function () {
     console.info('index page');


     var
     _body = $('body'),
     _nav_section = $('.navigation_section'),
     _con_section = $('.content_section');

     $('.btn_nav').bind('click', function () {
        if(_body.hasClass('open_nav')){
	        _nav_section.removeClass('col-md-2').addClass('blind');
	        _con_section.removeClass('col-md-10').addClass('col-md-12');
	        _body.removeClass('open_nav').addClass('close_nav');
        }else{
	        _nav_section.removeClass('blind').addClass('col-md-2');
	        _con_section.removeClass('col-md-12').addClass('col-md-10');
	        _body.removeClass('close_nav').addClass('open_nav');
        }
       return false;
     });

     // todo cookie에 저장하여 사용할 수 있도록 한다.

  }); // end of func