'use strict';
requirejs(
    [
        'common',
        'jquery',
    
    ],
    function (Common, $) {
    
        const
            form_content_register = $('#form_content_register'),
            btn_content_register_submit = $('#btn_content_register_submit'),
            btn_content_modify_submit = $('#btn_content_modify_submit'),
            form_content_modify = $('#form_content_modify'),
            btn_content_delete = $('.btn_content_delete'),
            btn_content_modify = $('.btn_content_modify');
    
        /**
         * 컨텐츠 등록
         */
        btn_content_register_submit.on('click', function () {
            Common.AjaxFormSubmit(form_content_register, (err, result) => {
                if (!err) {
                    alert(result.msg);
                    Common.refreshDisplay('body_content');
                } else {
                    alert(result.msg);
                }
            });
        });
    
        /**
         * 컨텐츠 수정
         */
        
        btn_content_modify.on('click', function () {
            console.log('adasda');
            const
                content_id = $(this).attr('data-id'),
                modal_id = $('#modifyContent');
            
            modal_id.find('#content_id').val(content_id);
        });
        

        btn_content_modify_submit.on('click', function () {
            Common.AjaxFormSubmit(form_content_modify, (err, result) => {
                if (!err) {
                    alert(result.msg);
                    Common.refreshDisplay('body_content');
                } else {
                    alert(result.msg);
                }
            });
        });
    
        /**
         * 컨텐츠 삭제
         */
        btn_content_delete.on('click', function () {
            const id = $(this).attr('data-id');
            Common.contentDelete(id, (err, result)=>{
                if (!err) {
                    alert(result.msg);
                    Common.refreshDisplay('body_content');
                } else {
                    alert(result.msg);
                }
            });
        });
    });