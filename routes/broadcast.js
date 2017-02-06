const
    express = require('express'),
    Broadcast = require('../service/BroadcastService'),
    router = express.Router();


router.get('/calendar', (req, res)=>{
    
    Broadcast.getCalendarList((err, result) => {
        if (!err) {
            res.render('bc_calendar',{
                current_path: 'bc_calendar',
                title: PROJ_TITLE + '방송 편성표',
                result : result
            });
        } else {
            res.status(500).send({ error: err});
        }
    });
});


router.get('/live', (req, res)=>{
    
    Broadcast.getLiveList((err, result) => {
        if (!err) {
            res.render('bc_live',{
                current_path: 'bc_live',
                title: PROJ_TITLE + '라이브 방송',
                live_result: (result.length ===0) ? false : result
            });
        } else {
            res.status(500).send({ error: err});
        }
    });
});


module.exports = router;