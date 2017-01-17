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
    , jquery_datatable: '/vendor/plugins/datatables/jquery.dataTables.min'
    , bootstrap_datatable: '/vendor/plugins/datatables/dataTables.bootstrap.min'
    , moment: '/vendor/plugins/moment/moment.2.11.2'
    , daterangepicker: '/vendor/plugins/daterangepicker/daterangepicker'
    , bootstrap_datepicker: '/vendor/plugins/datepicker/bootstrap-datepicker'
    , excellentExport: '/vendor/plugins/ExcellentExport/csv.2.0.0'
    , fastclick: '/vendor/plugins/fastclick/fastclick'
    , adminLTE: '/vendor/dist/js/app.min'
    , jqueryCookie: '/vendor/plugins/jquery_cookie/jquery.cookie.1.4.1'
    , jqueryValidate: '/vendor/plugins/jquery_validate/jquery.validate.min'
    , 'common': '/javascripts/common'
    , 'sum': '/vendor/plugins/datatables/sum.1.10.13'
    , 'select2': '/vendor/plugins/select2/select2.full.min'
    , 'lodash' : 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min'

  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'bootstrap_datatable': {
      deps: ['jquery', 'jquery_datatable']
    },
    'daterangepicker': {
      deps: ['jquery', 'moment']
    },
    'bootstrap_datepicker': {
      deps: ['jquery']
    },
    'adminLTE': {
      deps: ['jquery', 'bootstrap']
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
    'common': {
      deps: ['jquery', 'adminLTE']
    },
    'sum': {
      deps: ['jquery', 'adminLTE']
    },
    'select2': {
      deps: ['jquery', 'adminLTE']
    }
  }
});
