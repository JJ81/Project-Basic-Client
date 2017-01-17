/**
 * Created by yijaejun on 9/3/16.
 * todo 모듈 패턴으로 변경할 것
 * todo asset이 모두 다운로드될 때까지 뺑글이를 돌릴 수 있도록 설정한다.
 */
'use strict';
/**
 * Created by yijaejun on 14/12/2016.
 */
define(
  [
    'jquery',
    '/javascripts/player_fuc.js',
    '/javascripts/agents_util.js',
    'adminLTE',

  ], function ($, player_fuc, agents_util) {

    // player.showCreditModal();
    // 메뉴 오픈 상태를 변경할 상태 정보 업데이트
    $.AdminLTE.options.sidebarPushMenu = false;

    // get Current balance trigger event
    $('.get-current-balance').on('click', function () {
      $('.fa-refresh').addClass('fa-spin');
      getCurrentBalance(code);
    });

    /*모달을 닫으면 입력값 초기회 (모든 모달에 적용)*/
    $('.modal').on('hidden.bs.modal', function (e) {
      $(this).find('form')[0].reset()
    });

    /**
     * 해당 agent의 current balance 값을 가져온다
     * @Code : AgentCode
     */
    var code = $('#agent-code');


    function getCurrentBalance(code) {
      console.log('what is this?');

      $.ajax({
        url: '/api/v1/agent/get/self/current/balance?code=' + code.val().trim(),
        type: 'get',
        success: function (data, textStatus, jqXHR) {
          $('.balance-chip').text(addCommaOnNumber(data.current_balance));
          setTimeout(function () {
            $('.fa-refresh').removeClass('fa-spin');
          }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
          setTimeout(function () {
            $('.fa-refresh').removeClass('fa-spin');
          }, 1500);
        }
      })
    }


    // 중복 코드 관리할 것
    //function addCommaOnNumber(num) {
    //  if (num === null || isNaN(num)) {
    //    return 0;
    //  }
    //  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //}

    var utils = {
      checkExcessedNumber : function (inserted, max){
        if(parseInt(inserted) > parseInt(max)){
          return true;
        }
        return false;
      },

      removeFrontZeroNumber : function (str) {
        if(typeof str !== 'string'){
          str = str.toString();
        }

        var _str = str.split('');
        var _len = _str.length;
        //console.log('total : ' + _len);

        for(var i=0;i<_len;i++){
          if(_str[i] === '0'){
            _str.splice(0, 1);
          }else if(_str[i] !== '0'){
            // console.log('break : ' + i);
            break;
          }
        }

        return parseInt(_str.join(''));
      },

      addCommaInNumber : function (num) {
        if (num === null || isNaN(num)) {
          return 0;
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },

      removeCommasFromNumber : function (str) {
        if(typeof str !== 'string'){
          str = str.toString();
        }

        while (str.indexOf(",") !== -1) {
          str = (str + "").replace(',', '');
        }

        return parseInt(str);
      },

      // Window Pop-up
      popupNewWindow: function (url, title, option) {
        window.open(url, title, option);
      },

      /**
       * url은 파라미터키와 값을 포함한 것을 받는다.
       * @param el
       * @param url
       * @param title
       */
      openPopWindow: function (el, url, title) {
        this.popupNewWindow(url, title, "width=1024, height=800, resizable=yes, scrollbars=auto, status=no;");
      },

      showModal: function (el) {
        var _this = $(el);
        var info = {
          modal_id: _this.attr('data-modal-id'),
          user_id: _this.attr('data-user-id'),
          balance: _this.attr('data-balance')
        };
        utils.nclPlayerCurrentChip(info, player_fuc.showModal)
      },

      suspendPlayer: function (el) {
        var _this = $(el);
        var target_user_id = _this.attr('data-user-id');
        var suspend = _this.attr('data-suspend');
        console.log(target_user_id, suspend);
        player_fuc.suspendPlayer(target_user_id, suspend);
      },

      showModalAgent: function (el) {
        var _this = $(el);
        var info = {
          modal_id: _this.attr('data-modal-id'),
          agent_code: _this.attr('data-agent-code'),
          balance: _this.attr('data-balance')
        };

        agents_util.showModal(info);
      },

      // ACC
      observeCheckBox: function (el, target) {
        if (el.checked) {
          $(target).removeClass('blind');
        } else {
          $(target).addClass('blind');
        }
      },

      suspendAgent: function (el) {
        var _this = $(el);
        var target_agent_code = _this.attr('data-agent-code');
        var suspend = _this.attr('data-suspend');
        agents_util.suspendAgent(target_agent_code, suspend);
      },

      /**
       * @param info object {user_id, balance}
       * @param func : 최신 balance를 받은 이후 실행될 func
       */
      nclPlayerCurrentChip: function (info, func) {
        $.ajax({
          // TODO 실서버로 들어갔을 때 설정을 자유롭게 변경할 수 있도록 해야 한다
          url: 'https://dev-api.two-ace.com:8090/ncl-platform/api/v1/agent/operation/hc_glb/users/balance?userIds=' + info.user_id.trim(),
          type: 'get',
          async: false,
          success: function (data, textStatus, jqXHR) {
            if (info.modal_id === 'setPlayerPassword') {
              func(info);
              return
            }
            if (data.rows.length === 0 && info.modal_id !== 'setPlayerPassword') {
              alert('해당 유저가 아직 게임 가입을 진행하지 않은 상태입니다.');
              console.log(info);
            } else {
              setTimeout(function () {
                $('.fa-refresh').removeClass('fa-spin');
              }, 1500);
              info.user_id = data.rows[0].userId;
              info.balance = data.rows[0].chip;
              func(info);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('err!');
            setTimeout(function () {
              $('.fa-refresh').removeClass('fa-spin');
            }, 1500);
            alert('장애가 발생했습니다.  잠시후 시도해 주세요');
          }
        })
      },

      comma_number: function (num) {
        if (num === null || isNaN(num)) {
          return 0;
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },

      apiCallByAjax: function (form) {
        $.ajax({
          url: form.action,
          type: form.method,
          data: $(form).serialize(),
          success: function (data, textStatus, jqXHR) {
            console.log(data.success);
            if (data.success) {
              alert(data.msg);
              // location.reload();

              $('.modal').modal('hide');
              // $('#body').load(location.href + ' #body>*', '');

              location.reload();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong, Please try again later');
            window.location.reload();
          }
        });
      }
    };

    window.utils = utils; // todo 전역 객체에 하나에 바인딩을 하기 때문에 아래에서 리턴을 해줘도 사용하는 경우는 적을 것이다.
    return utils;
  });