'use strict';
requirejs(
    [
        'common',
        'jquery',
    ],
    function (Common, $) {
        
        const
            form_bc_calendar_upload= $('#form_bc_calendar_upload'),
            submit_bc_calendar_upload = $('#submit_bc_calendar_upload'),
            btn_calendar_delete = $('#btn_calendar_delete');
            
    
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
    
        /**
         * 편성표 삭제
         */

        btn_calendar_delete.on('click', function () {
            
            const check_confirm = confirm('삭제를 진해하시겠습니까?');
            
            if (check_confirm){
                const id = $(this).attr('data-id');
                
                Common.broadcastCalendarDelete(id, function (err, result) {
                    if (!err) {
                        alert(result.msg);
                        Common.refreshDisplay('body_bc_calendar');
                        
                        // $('#body_bc_calendar').load(location.href+' #body_bc_calendar>*', '');
                    } else {
                        alert(result.msg);
                    }
                });
            }
        });
    });