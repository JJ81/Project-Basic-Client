'use strict';
requirejs(
    [
        'common',
        'jquery',
    
    ],
    function (Common, $) {
    
        const
            form_content_register = $('#form_content_register'),
            btn_content_register_submit = $('#btn_content_register_submit');
    
        /**
         * 컨텐츠 등록
         */
        // btn_content_register_submit.on('click', function () {
        //     Common.AjaxFormSubmit(form_content_register, function (err, result) {
        //         if (!err) {
        //             alert(result.msg);
        //             Common.refreshDisplay('body_content');
        //         } else {
        //             alert(result.msg);
        //         }
        //     });
        // });
    
    
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
        
    });