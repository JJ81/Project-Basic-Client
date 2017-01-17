'use strict';

requirejs(
  [
    'jquery'
    , 'select2'
    , 'common'
    , 'bootstrap'
    , 'jquery_datatable'
    , 'bootstrap_datatable'
    , 'fastclick'
    , 'jqueryValidate'
    , 'adminLTE'
    ,'/javascripts/agents_util.js'
  ],
  function (jQuery, select2) {
    var $ = jQuery;
    // var DataTable= jquery_datatable;


    $('.select2').select2({
      width: '100%'
    });

    var table_agent = $('#table_agent').DataTable({
      "paging": false,
      "lengthChange": true,
      "searching": false,
      "ordering": false,
      "info": true,
      "autoWidth": true
    });


    // var table_agent = $('#table_agent').dataTable();


    // $('.btn-danger').on('click', function () {
    //   console.log('ad');
    //   table_agent.draw(_data);
    // });
  }
);
