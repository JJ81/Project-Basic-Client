const
    express = require('express'),
    Broadcast = require('../service/BroadcastService'),
    router = express.Router();


router.get('/calendar', (req, res)=>{
    res.render('bc_calendar',{
        current_path: 'bc_calendar',
        title: PROJ_TITLE + 'login'
    });
});


router.get('/live', (req, res)=>{
    
    Broadcast.getList((err, result) => {
        if (!err) {
            console.log(result.length);
            res.render('bc_live',{
                current_path: 'bc_live',
                title: PROJ_TITLE + 'login',
                live_result: (result.length ===0) ? false : result
            });
        } else {
            res.json(err);
        }
    });
    
    
});


module.exports = router;