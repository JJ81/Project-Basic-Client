/**
 * Created by yijaejun on 14/12/2016.
 */
define(
	[
		'jquery'
		, 'adminLTE'
	], function ($) {

		// console.info($);

		// 메뉴 오픈 상태를 변경할 상태 정보 업데이트
		$.AdminLTE.options.sidebarPushMenu = false;

		// get Current balance trigger event
		$(document).on('click', '.get-current-balance', function () {
			getCurrentBalance(code);
		});

		/**
		 * 해당 agent의 current balance 값을 가져온다
		 * @Code : AgentCode
		 */
		var code = $('#agent-code');
		function getCurrentBalance(code) {
			$.ajax({
				url: '/api/v1/agent/get/current/balance?code=' + code.val().trim(),
				type: 'get',
				success: function (data, textStatus, jqXHR) {
					$("#navbar-custom-menu").load(location.href + " #navbar-custom-menu>*", ''); //comment list reload
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(errorThrown);
				}
			})
		}

		// Window Pop-up
		function popupNewWindow(url, title, option) {
			window.open(url, title, option);
		}

		return {
			popupNewWindow: popupNewWindow
		}
	});
