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
    $('.btn_download_csv_financial').bind('click', function () {
      return excellentCsv.csv(this, 'table_financial', ',');
    });

    var table_financial = null;
    var _pos = $('.viewType').val().trim();
    if (_pos === 'player') {
      console.log('player');
      table_financial =
        $('#table_financial').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": false, // true로 할 경우 버그가 발생한다.
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr>" +
              "<th colspan='3' class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(3, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(4, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(5, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(6, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='center'>Action</th>" +
              "</tr>"
            );
          }
        });

      table_financial
        .column('0:visible')
        .order('desc')
        .draw();
    } else if (_pos === 'agent') {
      console.log('agent');
      table_financial =
        $('#table_financial').DataTable({
          "paging": false,
          "lengthChange": true,
          "searching": false,
          "ordering": false,
          "info": false,
          "autoWidth": false, // true로 할 경우 버그가 발생한다.
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr>" +
              "<th class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(1, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(2, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(3, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(4, {page: 'current'}).data().sum()) + "</th>" +
              "</tr>"
            );
          }
        });

      // table_financial
      // 	.column('0:visible')
      // 	.order('desc')
      // 	.draw();


    } else if (_pos === 'day') {
      console.log('day');
      table_financial =
        $('#table_financial').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": false, // true로 할 경우 버그가 발생한다.
          "processing": true,
          "drawCallback": function () {
            var api = this.api();
            $(api.table().footer()).html(
              "<tr>" +
              "<th class='center'>Total</th>" +
              "<th class='right'>" + utils.comma_number(api.column(1, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(2, {page: 'current'}).data().sum()) + "</th>" +
              "<th class='right'>" + utils.comma_number(api.column(3, {page: 'current'}).data().sum()) + "</th>" + // TODO 음수간의 데이터 sum이 제대로 되지 않는다.
              "<th class='right'>" + utils.comma_number(api.column(4, {page: 'current'}).data().sum()) + "</th>" +
              "</tr>"
            );
          }
        });

      table_financial
        .column('0:visible')
        .order('desc')
        .draw();
    } else {
      console.error('Where am I?');
    }

    // End of Datatable settings


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

    // 각 칼럼에 대해서 검색하기
    $('.nickname').on('keyup', function () {
      var _value = $(this).val().trim();
      table_financial
        .search(_value)
        .draw();
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

      // todo 매칭이 유사한 것도 결과값으로 출력되는 문제가 있다.
      table_financial.columns(2).search(_val).draw();

    });


  }); // end of func