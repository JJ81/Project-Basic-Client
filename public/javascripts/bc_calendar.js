'use strict';
requirejs(
    [
        'common',
        'jquery',
    ],
    function (Common, $) {
        
        const
            form_bc_calendar_upload= $('#form_bc_calendar_upload'),
            submit_bc_calendar_upload = $('#submit_bc_calendar_upload');
            
    
        /**
         * 편성표 업로드
         */
        submit_bc_calendar_upload.on('click', function () {
            Common.AjaxFormSubmit(form_bc_calendar_upload, function (err, result) {
                if (!err) {
                    alert(result.msg);
                    $('#body_bc_calendar').load(location.href+' #body_bc_calendar>*', '');
                } else {
                    alert(result.msg);
                }
            });
        });
    });