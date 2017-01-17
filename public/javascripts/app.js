/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
  map: {},
  paths: {
    jquery: ['/components/jquery/dist/jquery.min'],
    bootstrap : ['/components/bootstrap/dist/js/bootstrap.min'],
    jqueryCookie : ['/components/jquery.cookie/jquery.cookie'],
    jqueryValidate : ['/components/jquery-validation/dist/jquery.validate.min'],
    lodash : ['/components/lodash/dist/lodash.min'],
    fastclick : ['/components/fastclick/lib/fastclick'],
    common : ['/javascripts/common']
  },
  shim: {
    jqueryValidate : ['jquery'],
    jqueryCookie : ['jquery']
  }
});
