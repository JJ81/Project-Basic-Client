/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
  map: {},
  paths: {
    jquery: ['/vendor/plugins/jQuery/jquery-2.2.3.min']
    , jquery_ui: '/vendor/plugins/jQueryUI/jquery-ui.min'
    , bootstrap: ['/vendor/bootstrap/js/bootstrap.min']
    , jqueryCookie: '/vendor/plugins/jquery_cookie/jquery.cookie.1.4.1'
    , jqueryValidate: '/vendor/plugins/jquery_validate/jquery.validate.min'
    , 'common': '/javascripts/common'
    , 'select2': '/vendor/plugins/select2/select2.full.min'
    , 'lodash' : 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min'
    , fastclick: '/vendor/plugins/fastclick/fastclick'
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'jquery_ui': {
      deps: ['jquery']
    },
    'jqueryCookie': {
      deps: ['jquery']
    },
    'jqueryValidate': {
      deps: ['jquery']
    },
    'select2': {
      deps: ['jquery']
    }
  }
});
