define(
  [
    'jquery',
    '../common',
    'lodash',
    'adminLTE',
    'jqueryValidate',
    'select2'
  ], function ($, Common, _) {
    var frm_create_agent = $('#frm_create_agent');
    var frm_set_agent_password = $('#frm_set_agent_password');
    var btn_dropdown_action = $('.btn-dropdown-action');
    var my_code = $('#agent-code');
    var frm_credit_to = $('#frm_credit_to');
    var frm_debit_to = $('#frm_debit_to');
    var btn_current_balance = $('.btn-get-agent-current-balance');
    var amount_to_agent = $('.amount_to_agent');
    var sum_balance = $('.sum_balance');
    var
      target_agent_code = null,
      balance = null,
      parent_id = null,
      layer = null,
      suspend = null,
      // newBalance = null,
      // currentBalance = null,
      amount = null,
     _modal = null;


    var _info_cache = {}; // cached balance info temporarily


    /*dropdown action click시 데이터 바인딩*/
    btn_dropdown_action.on('click', function () {
      target_agent_code = ($(this).attr('data-agent-code'));
      balance = utils.addCommaInNumber($(this).attr('data-balance'));
      parent_id = ($(this).attr('data-parent_id'));
      layer = ($(this).attr('data-layer'));
      suspend = ($(this).attr('data-suspend'));
      getCurrentBalance( my_code.val(), target_agent_code, showCurrentBalanceInModal);
    });


    // Prevent from inserting minus character.
    amount_to_agent.bind('keydown', function (e) {
      if(e.keyCode === 189 || e.keyCode === 13){
        console.log('prevent minus and enter event');
        return false;
      };
    });

    amount_to_agent.bind('keyup', _.debounce(function (e) {
      console.log('check!!!!');

      var _tmp = utils.removeCommasFromNumber($(this).val());
      var _val = utils.removeFrontZeroNumber(_tmp);

      // 나의 밸런스보다 초과할 경우
      if(utils.checkExcessedNumber(_val, _info_cache.myBalance)){
        alert('Please check again your balance remained');
        $(this).val(0);
      }else{
        $(this).val(utils.addCommaInNumber(_val));
      }


      // 입력한 amount 값을 현재 에이전트의 밸런스와 합산을 진행한다.
      sum_balance.val(
        utils.addCommaInNumber(
          parseInt(_info_cache.target_balance) + parseInt(utils.removeCommasFromNumber($(this).val()))
        )
      );
    }, 1000, {'maxWait' : 3000}));


    //amount_to_agent.bind('change', function (e) {
    //  var _val = utils.addCommaInNumber($(this).val());
    //  $(this).val(_val);
    //
    //  // todo 입력한 amount 값을 현재 에이전트의 밸런스와 합산을 진행한다.
    //  sum_balance.val(
    //    utils.addCommaInNumber(
    //      parseInt(_info_cache.target_balance) + parseInt(utils.removeCommasFromNumber($(this).val()))
    //    )
    //  );
    //});


    btn_current_balance.on('click', function () {
      $(this).find('.fa-refresh').addClass('fa-spin');
      // 최신 밸런스로 변경하는 액션
      getCurrentBalance( my_code.val(), target_agent_code, showCurrentBalanceInModal);
    });

    /**
     * info :{my_balance, target_balance}
     */
    function showCurrentBalanceInModal(info) {
      $('.my_balance').val(
        utils.addCommaInNumber(info.my_balance)
      );

      $('.target_current_balance').val(
        utils.addCommaInNumber(info.target_balance)
      );
    }

    /**
     * @param myCode
     * @param targetCode
     * @param func : current balance를 가져왔을때 실행될 함수
     */
    function getCurrentBalance(myCode, targetCode, func) {
      $.ajax({
        url: '/api/v1/agent/get/current/balance?my_code=' + myCode + '&target_code=' + targetCode,
        type: 'get',
        success: function (data, textStatus, jqXHR) {
          if (data.success) {
            setTimeout(function () {
              $('.fa-refresh').removeClass('fa-spin');
            }, 1500);

            // cache in memory
            _info_cache.myBalance = data.my_balance;
            _info_cache.target_balance = data.target_balance;

            func({
              my_balance: data.my_balance,
              target_balance: data.target_balance
            });

          } else {
            alert('Somthing went wrong. Please try again later');
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          setTimeout(function () {
            $('.fa-refresh').removeClass('fa-spin');
          }, 1500);

          console.error(errorThrown);
        }
      });
    }


    var btnCreditToSubmit = $('.btn-credit-to-submit');
    btnCreditToSubmit.bind('click', function (e) {
      e.preventDefault();


      // todo 숫자인지를 체크

      // todo amount가 음수인지 체크

      // todo 숫자 외에 string이 들어가 있는지 체크한다.

      if(amount_to_agent.val() === ''){
        amount_to_agent.focus();
        alert('Insert amount correctly.');
        return false;
      }

      frm_credit_to.submit();

    });




    // ********** Validation Setting  ********** //
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


    frm_create_agent.validate({
      onkeyup: false,
      submitHandler: function (form) {
        var f = confirm("Do you want to create new Agent?");
        if (f) {
          utils.apiCallByAjax(form);
        } else {
          return false;
        }
      },
      rules: {
        create_agent_code: {
          required: true,
          minlength: 4,
          remote: {
            async: false,
            url: '/api/v1/agent/duplicated',
            type: 'post',
            dataFilter: function (data) {
              var json = JSON.parse(data);
              console.log(json);
              if (json.success && json.duplicated) {
                console.log('false');
                return "\"" + 'This code is already in use.' + "\"";
              } else {
                console.log('success');
                return true;
              }
            }
          }
        },
        pass: {
          required: true,
          minlength: 4
        },
        re_pass: {
          required: true,
          minlength: 4,
          equalTo: $('#create-agent-password')
        },
        creditCap: {
          required: true,
          number: true
        }
      }
    });

    frm_set_agent_password.validate({
      submitHandler: function (form) {
        var f = confirm("작업을 완료하겠습니까?");
        if (f) {
          utils.apiCallByAjax(form);
        } else {
          return false;
        }
      },
      //규칙
      rules: {
        pass: {
          required: true,
          minlength: 4
        },
        re_pass: {
          required: true,
          minlength: 4,
          equalTo: '#set_password'
        }
      }
    });




    //frm_credit_to.validate({
    //  submitHandler: function (form) {
    //    // todo 영문으로 변경할 것.
    //
    //    // todo submit을 하는 시점에서 다시 값을 뽑아낸다.
    //    //var _amount = null;
    //    //var _newBalance = nll;
    //
    //    console.info('form!!');
    //    console.info(form);
    //
    //
    //
    //    var submit_check = confirm('Please check your balance, is it alright?');
    //    if (submit_check) {
    //      utils.apiCallByAjax(form);
    //    } else {
    //      return false;
    //    }
    //  },
    //  rules: {
    //    target: {
    //      required: true
    //    },
    //    balance: {
    //      required: false
    //    },
    //    sum_balance: {
    //      required: false
    //      //,min: 1
    //    },
    //    amount: {
    //      required: false
    //      //,range: [1, $('#my_current_balance').val()]
    //    },
    //    memo: {
    //      required: false
    //    }
    //  }
    //});

    //frm_debit_to.validate({
    //  submitHandler: function (form) {
    //    var submit_check = confirm('입력하신 Amount : ' + amount + '$ 총합산 Balance : ' + newBalance + '$가 맞습니까?');
    //    if (submit_check) {
    //      utils.apiCallByAjax(form);
    //    } else {
    //      return false;
    //    }
    //  },
    //  rules: {
    //    target: {
    //      required: true
    //    },
    //    sum_balance: {
    //      required: false
    //      //,min: 0
    //    },
    //    balance: {
    //      required: false
    //    },
    //    amount: {
    //      required: false
    //      //,min: 1
    //      // range: [1, 1670]
    //    },
    //    memo: {
    //      required: false
    //    }
    //  }
    //});


    function showModal(info) {
      _modal = $('#' + info.modal_id);
      _modal.modal('show');
      _modal.find('.target_agent_code').val(info.agent_code);
      _modal.find('.target_current_balance').val(utils.addCommaInNumber(info.balance));
    }


    function suspendAgent(target_agent_code, suspend) {
      var check = confirm('Dp you want to suspend this Agent?');
      if (check) {
        $.post('/api/v1/agent/to/suspend', {code: target_agent_code, suspend: suspend}).done(function (data) {
          console.log(typeof  data);
          console.log(data);
          if (data.success) {
            alert(data.msg);
            location.reload();
          } else {
            alert('Something went wrong. Please Try again');
          }
        })
      }
    }

    $('.checkbox_acc').on('change', function () {
      if ($(this).is(':not(:checked)')) {
        console.log('checkbox is not checked');
        $('.check_acc').val('');
      }
    });


    return {
      showModal: showModal,
      suspendAgent: suspendAgent
    }
  }
);