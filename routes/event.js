/**
 * Created by cheese on 2017. 2. 2..
 */

const
    express = require('express'),
    router = express.Router(),
    Event = require('../service/Eventservice');



router.get('/result', (req, res)=>{
    
    Event.getList((err, result)=>{
        if(!err){
            res.render('event_result',{
                current_path: 'event_result',
                title: PROJ_TITLE + '이벤트',
                result: result
            });
        }else{
            res.status(500).send({ error: err});
        }
        
    });
    
    
    
});

module.exports = router;