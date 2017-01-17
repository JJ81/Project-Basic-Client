/**
 * Created by yijaejun on 03/12/2016.
 */
/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
  [
    'jquery'
    , 'moment'
    , 'excellentExport'
    , 'bootstrap'
    , 'jquery_datatable'
    , 'bootstrap_datatable'
    , 'daterangepicker'
    , 'jquery_ui'
    , 'adminLTE'
    , 'fastclick'
    , 'common'
    , 'sum'
  ],
  function ($, moment, excellentCsv) {
    // avoid to confliction between jquery tooltip and bootstrap tooltip
    $.widget.bridge('uibutton', $.ui.button);

    // Download csv
    $('.btn_download_csv_game').bind('click', function () {
      return excellentCsv.csv(this, 'table_game', ',');
    });

    /**
     * todo 페이지 위치에 따라서 footer의 표현과 정렬방식을 달리 설정한다.
     * @type {jQuery}
     */
    var table_game = null;
    var _pos = $('.viewType').val().trim();
    if (_pos === 'player') {

      console.log('player');

      table_game =
        $('#table_game').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr><th colspan='3' class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(3, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(4, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='center'>Action</th></tr>"
            );
          }
        });

      table_game
        .column('0:visible')
        .order('desc')
        .draw();

    } else if (_pos === 'agent') {
      console.log('agent');

      table_game =
        $('#table_game').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr><th class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(1, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(2, {page: 'current'}).data().sum()) + "</th>" +
              "</tr>"
            );
          }
        });

      table_game
        .column('0:visible')
        .order('desc')
        .draw();

    } else if (_pos === 'day') {
      console.log('day');

      table_game =
        $('#table_game').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr><th class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(1, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(2, {page: 'current'}).data().sum()) + "</th>" +
              "</tr>"
            );
          }
        });

      table_game
        .column('0:visible')
        .order('desc')
        .draw();
    } else {
      console.error('Where am I?');
    }
    // End of Datatable


    // datepicker
    $('#daterange-btn').daterangepicker({
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(30, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
      },
      function (start, end) {
        $('#daterange-btn span').html(start.format('YYYY.MM.DD') + ' - ' + end.format('YYYY.MM.DD'));
      });


    // 각 칼럼에 대해서 검색하기
    $('.nickname').on('keyup', function () {
      var _value = $(this).val().trim();
      table_game
        .search(_value)
        .draw();
    });


    // Filtering with date
    $('.daterangepicker .ranges li, .daterangepicker .applyBtn').bind('click', function () {
      if ($(this).text().trim() === 'Custom Range') {
        return;
      }

      setTimeout(function () {
        var date = $('.filter_date').text();

        console.info(date);

        date = date.split('-');
        console.info(date);

        $('#startDt').val(date[0].trim());
        $('#endDt').val(date[1].trim());

        $('.frm_search').submit();

      }, 100);
    });

    // daterangepicker의 액션을 제어하기 귀찮아서 액티브를 제거한다.
    $('#daterange-btn').bind('click', function () {
      $('.daterangepicker .ranges li').removeClass('active');
      $('.daterangepicker .ranges').bind('mouseover', function () {
        $('.daterangepicker .ranges li').removeClass('active');
      })
    });

    // Implement with datatables's API
    $('.realSelectBox').bind('change', function () {
      var _self = $(this);
      var _val = _self.children('option:selected').val();

      if (_val === 'Any Agent') {
        _val = '';
      }
      table_game.columns(2).search(_val).draw();
    });
  }); // end of func