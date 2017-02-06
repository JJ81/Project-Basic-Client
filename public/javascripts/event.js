/**
 * Created by cheese on 2017. 2. 6..
 */
'use strict';
requirejs(
    [
        'common',
        'jquery',
    
    ],
    function (Common, $) {
        
        const
            submit_event_upload = $('#submit_event_upload'),
            form_event_upload = $('#form_event_upload');
    
    
        submit_event_upload.on('click', function () {
            Common.AjaxFormSubmit(form_event_upload, (err, result) => {
                if (!err) {
                    alert(result.msg);
                    Common.refreshDisplay('body_event');
                    
                } else {
                    alert(result.msg);
                }
            });
        });
        
        
        
    });