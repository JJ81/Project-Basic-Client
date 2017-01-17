/**
 * Created by yijaejun on 03/12/2016.
 */
'use strict';
define(
  [
    'jquery'
    , 'common'
    , 'adminLTE'
    , 'jqueryValidate'
  ], function ($) {

    var
      target_current_balance = $('.target_current_balance'),
      target_user_id = $('.target_user_id'),
      frm_credit_to_player = $('#frm_credit_to_player'),
      frm_debit_to_player = $('#frm_debit_to_player'),
      sum_balance = $('.sum_balance'),
      credit_amount = $('#credit_amount'),
      debit_amount = $('#debit_amount'),
      player_balance = null,
      user_id = null,
      modal_id = null,
      btn_refresh_player_balance = $('.btn-get-current-balance'),
      frm_create_player = $('#frm_create_player'),
      frm_set_player_password = $('#frm_set_player_password');


    function showModal(info) {
      modal_id = $('#' + info.modal_id);
      user_id = info.user_id;
      player_balance = Number(info.balance);
      modal_id.modal('show');
      modal_id.find('.target_user_id').val(user_id);
      modal_id.find('.target_current_balance').val(player_balance);
    }


    function suspendPlayer(target_user_id, suspend) {
      // todo 질문에 대한 영문 변환 및 한글 변환에 대한 설정을 따로 진행할 것
      var check = confirm('작업을 진행하시겠씁니까?');
      if (check) {
        $.post('/api/v1/player/to/suspend', {target_user_id: target_user_id, suspend: suspend}).done(function (data) {
          if(data.success){
            alert(data.msg);
            location.reload();
          }else{
            alert('Please try again');
          }
        })
      }
    }

    credit_amount.on('change', function () {
      var new_balance = creditBalance(player_balance, credit_amount.val());
      sum_balance.val(new_balance);
    });

    debit_amount.on('change', function () {
      var new_balance = debtBalance(player_balance, debit_amount.val());
      sum_balance.val(new_balance);
    });

    function creditBalance(balance, amount) {
      return Number(Number(balance) + Number(amount));
    }

    function debtBalance(balance, amount) {
      return Number(Number(balance) - Number(amount));
    }


    btn_refresh_player_balance.on('click', function () {
      var info = {user_id: user_id};
      $('.fa-refresh').addClass('fa-spin');

      utils.nclPlayerCurrentChip(info, refreshBalance);
    });

    /**
     * @param info
     */
    function refreshBalance(info) {
      target_current_balance.val(info.balance);
    }


    /*validation err 발생시  has-error 표시*/
    $.validator.setDefaults({
      highlight: function (el) {
        $(el).closest('.form-group').addClass('has-error');
      },
      unhighlight: function (el) {
        $(el).closest('.form-group').removeClass('has-error');
      },
      errorElement: 'span',
      errorClass: 'help-block',
      errorPlacement: function (error, element) {
        if (element.parent('.input-group').length) {
          error.insertAfter(element.parent());
        } else {
          error.insertAfter(element);
        }
      }
    });

    frm_create_player.validate({
      onkeyup: false,
      submitHandler: function (form) {
        var check = confirm('회원 가입을 완료 시키겠습니까?');
        if (check) {
          /* HC 회원 가입API  호출할것*/
          utils.apiCallByAjax(form);
        } else {
          return false
        }
      },
      rules: {
        user_id: {
          required: true,
          minlength: 8,
          remote: {
            async: false,
            url: 'http://holdemclub.tv/api/v1/user_id/duplicated', // todo API호출 설정을 제한적으로 열어둘 수 있도록 IP를 추가할 것.
            type: 'get',
            dataFilter: function (data) {
              var data = JSON.parse(data);
              if (data.success && data.data.length === 0) {
                return true
              } else {
                return "\"" + 'Is the Player Id that is already in use.' + "\"";
              }
            }
          }
        },
        nickname: {
          required: true,
          minlength: 4,
          remote: {
            async: false,
            url: 'http://holdemclub.tv/api/v1/nickname/duplicated',
            type: 'get',
            dataFilter: function (data) {
              var data = JSON.parse(data);
              if (data.success && data.data.length === 0) {
                return true
              } else {
                return "\"" + 'Is the Nickname that is already in use.' + "\"";
              }
            }
          }
        },
        email: {
          // required: true,
          email: true,
          remote: {
            async: false,
            url: 'http://holdemclub.tv/api/v1/signup/email/duplicated',
            type: 'get',
            dataFilter: function (data) {
              var data = JSON.parse(data);
              if (data.success && data.data.length === 0) {
                return true
              } else {
                return "\"" + 'Is the Nickname that is already in use.' + "\"";
              }
            }
          }
        },
        password: {
          required: true,
          minlength: 8
        },
        re_password: {
          required: true,
          minlength: 8,
          equalTo: '#user_pass'
        }
      }
    });


    //frm_credit_to_player.validate({
    //  submitHandler: function (form) {
    //    var check = confirm('작업을 완료하겠습니까?');
    //    if (check) {
    //      utils.apiCallByAjax(form);
    //    } else {
    //      return false
    //    }
    //  },
    //  rules: {
    //    target: {
    //      required: true
    //    },
    //    balance: {
    //      required: true
    //    },
    //    sum_balance: {
    //      required: true,
    //      min: 1
    //    },
    //    amount: {
    //      required: true,
    //      range: [1, $('#agent-balance').val()]
    //    },
    //    memo: {
    //      required: true
    //    }
    //  }
    //});
    //
    //frm_debit_to_player.validate({
    //  submitHandler: function (form) {
    //    var check = confirm('작업을 완료하겠습니까?')
    //    if (check) {
    //      utils.apiCallByAjax(form);
    //    } else {
    //      return false
    //    }
    //  },
    //  rules: {
    //    target: {
    //      required: true
    //    },
    //    balance: {
    //      required: true
    //    },
    //    sum_balance: {
    //      required: true,
    //      min: 0
    //    },
    //    amount: {
    //      required: true,
    //      min: 1
    //    },
    //    memo: {
    //      required: true
    //    }
    //  }
    //});

    frm_set_player_password.validate({
      submitHandler: function (form) {
        var check = confirm('작업을 완료하겠습니까?');
        if (check) {
          utils.apiCallByAjax(form);
        } else {
          return false
        }
      },
      rules: {
        password: {
          required: true,
          minlength: 8
        },
        re_password: {
          required: true,
          minlength: 8,
          equalTo: '#set_player_password'
        }
      }
    });

    return {
      showModal: showModal,
      suspendPlayer: suspendPlayer
    };
  });