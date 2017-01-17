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
		,'moment'
		,'excellentExport'
		,'bootstrap'
		,'jquery_datatable'
		,'bootstrap_datatable'
		,'daterangepicker'
		,'jquery_ui'
		,'adminLTE'
		,'fastclick'
		,'common'
		,'sum'
	],
	function ($, moment, excellentCsv) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

		// Download csv
		$('.btn_download_csv_financial').bind('click', function (){
			return excellentCsv.csv(this, 'table_player_history', ',');
		});

		// set table func.
		var table_player_history =
			$('#table_financial').DataTable({
				"paging": true,
				"lengthChange": true,
				"searching": false,
				"ordering": true,
				"info": true,
				"autoWidth": false, // true로 할 경우 버그가 발생한다.
				"processing": true
				,"drawCallback": function () {
					var api = this.api();
					$( api.table().footer() ).html(
						"<tr><th class='center'>Date</th>" +
						"<th class='right'>" + api.column( 1, {page:'current'} ).data().sum() + "</th>" +
						"<th class='right'>" + api.column( 2, {page:'current'} ).data().sum() + "</th>" +
						"<th class='right'>" +api.column( 3, {page:'current'} ).data().sum() + "</th>" +
						"<th class='right'>" + api.column( 4, {page:'current'} ).data().sum() + "</th>" +
						"<th class='center'>Desc.</th></tr>"
					);
				}
			});



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
				$('#daterange-btn span').html(start.format('YYYY.M.D') + ' - ' + end.format('YYYY.M.D'));
			});

		// Filtering with date
		$('.daterangepicker .ranges li, .daterangepicker .applyBtn').bind('click', function () {
			if($(this).text().trim() === 'Custom Range'){
				return;
			}

			setTimeout(function () {
				var date = $('.filter_date').text();

				// console.info(date);

				date = date.split('-');
				// console.info(date);

				$('#startDt').val(date[0].trim());
				$('#endDt').val(date[1].trim());

				$('.frm_search').submit();

			}, 100);
		});

		// Common에서 모든 페이지에서 호출을 할 수 있도록 한다?
		// daterangepicker의 액션을 제어하기 귀찮아서 액티브를 제거한다.
		$('#daterange-btn').bind('click', function () {
			$('.daterangepicker .ranges li').removeClass('active');
			$('.daterangepicker .ranges').bind('mouseover', function () {
				$('.daterangepicker .ranges li').removeClass('active');
			})
		});



	}); // end of func